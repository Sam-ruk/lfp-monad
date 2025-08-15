import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';
import { Web3 } from 'web3';

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

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function'
  }
];

export async function POST(req: NextRequest) {
  const { discord_id, wallet_address } = await req.json();
  
  if (!discord_id || !wallet_address || typeof discord_id !== 'string' || typeof wallet_address !== 'string') {
    return NextResponse.json({ error: 'Discord ID and wallet address required' }, { status: 400 });
  }

  const web3 = new Web3(process.env.RPC_URL!);
  
  if (!web3.utils.isAddress(wallet_address)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
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
      
      if (hoursLeft > 0) {
        return NextResponse.json({ 
          error: 'Token already sent', 
          timeLeft: Math.ceil(hoursLeft * 60) 
        }, { status: 429 });
      }
    }

    const tokenContract = new web3.eth.Contract(
      ERC20_ABI as any,
      process.env.NEXT_PUBLIC_TOKEN_CONTRACT!
    );

    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY!);
    web3.eth.accounts.wallet.add(account);

    const decimals = await tokenContract.methods.decimals().call();
    
    // Calculate amount (10 tokens)
    const amount = BigInt(10) * BigInt(10) ** BigInt(Number(decimals));

    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await tokenContract.methods
      .transfer(wallet_address, amount.toString())
      .estimateGas({ from: account.address });

    const tx = await tokenContract.methods
      .transfer(wallet_address, amount.toString())
      .send({
        from: account.address,
        gas: gasEstimate.toString(),
        gasPrice: gasPrice.toString()
      });

    const updateData: Partial<UserData> = {
      discord_id,
      wallet_address,
      last_claim: new Date(),
      transaction_hash: tx.transactionHash
    };

    await collection.updateOne(
      { discord_id },
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      transaction_hash: tx.transactionHash,
      message: 'Token sent successfully!' 
    });
  } catch (error) {
    console.error('Token send error:', error);
    return NextResponse.json({ error: 'Failed to send token' }, { status: 500 });
  }
}