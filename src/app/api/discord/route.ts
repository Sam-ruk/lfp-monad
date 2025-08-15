import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!)}&response_type=code&scope=identify%20guilds`;
  
  return NextResponse.redirect(discordAuthUrl);
}