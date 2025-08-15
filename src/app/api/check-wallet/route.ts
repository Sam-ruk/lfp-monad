import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

interface UserData {
  discord_id: string;
  wallet_address: string;
  last_claim: Date;
  transaction_hash: string;
}

let client: MongoClient;

async function connectToDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URL!);
    await client.connect();
  }
  return client.db('lfp_game');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const discord_id = searchParams.get('discord_id');
  
  if (!discord_id) {
    return NextResponse.json({ error: 'Discord ID required' }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection<UserData>('users');
    
    const existingUser = await collection.findOne({ discord_id });
    
    if (existingUser) {
      const now = new Date();
      const lastClaim = new Date(existingUser.last_claim);
      const timeDiff = now.getTime() - lastClaim.getTime();
      const hoursLeft = 24 - (timeDiff / (1000 * 60 * 60));
      
      return NextResponse.json({
        wallet_address: existingUser.wallet_address,
        token_sent: hoursLeft > 0,
        timeLeft: Math.max(0, Math.ceil(hoursLeft * 60)), // minutes
        transaction_hash: existingUser.transaction_hash
      });
    }

    return NextResponse.json({
      wallet_address: null,
      token_sent: false,
      timeLeft: 0
    });
  } catch (error) {
    console.error('Wallet check error:', error);
    return NextResponse.json({ error: 'Failed to check wallet status' }, { status: 500 });
  }
}