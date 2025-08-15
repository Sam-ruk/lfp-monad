import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const discord_id = searchParams.get('discord_id');
  
  if (!discord_id) {
    return NextResponse.json({ error: 'Discord ID required' }, { status: 400 });
  }

  try {
    console.log(`Checking server membership for user: ${discord_id}`);
    console.log(`Server ID: ${process.env.NEXT_PUBLIC_LFP_SERVER_ID}`);
    console.log(`Bot token present: ${!!process.env.DISCORD_BOT_TOKEN}`);
    
    const response = await fetch(`https://discord.com/api/guilds/${process.env.NEXT_PUBLIC_LFP_SERVER_ID}/members/${discord_id}`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`Discord API response status: ${response.status}`);
    
    if (response.status === 200) {
      console.log(`User ${discord_id} is in server`);
      return NextResponse.json({ isInServer: true });
    } else if (response.status === 404) {
      console.log(`User ${discord_id} is not in server`);
      return NextResponse.json({ isInServer: false });
    } else {
      const errorText = await response.text();
      console.error(`Discord API error: ${response.status} - ${errorText}`);
      return NextResponse.json({ isInServer: false, error: `API Error: ${response.status}` });
    }
    
  } catch (error) {
    console.error('Server check error:', error);
    return NextResponse.json({ 
      isInServer: false, 
      error: 'Failed to check server membership' 
    });
  }
}