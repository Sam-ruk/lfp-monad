import { NextRequest, NextResponse } from 'next/server';

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  display_name: string;
  global_name: string;
  discriminator: string;
  avatar: string | null;
}

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', req.url));
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      }),
    });

    const tokenData: DiscordTokenResponse = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token');
    }

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userData: DiscordUser = await userResponse.json();

    const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const guildsData: DiscordGuild[] = await guildsResponse.json();
    const isInServer = guildsData.some(guild => guild.id === process.env.NEXT_PUBLIC_LFP_SERVER_ID);

    const redirectUrl = new URL('/auth/callback', req.url);
    redirectUrl.searchParams.set('discord_id', userData.id);
    redirectUrl.searchParams.set('discord_username', userData.username);
    redirectUrl.searchParams.set('discord_display_name', userData.display_name || userData.global_name || userData.username);
    redirectUrl.searchParams.set('is_in_server', isInServer.toString());
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Discord auth error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
  }
}