import { MongoClient, MongoClientOptions, Db, Collection } from 'mongodb';
import { NextResponse } from 'next/server';

interface TrackerData {
  id: string;
  nft_today: number[];
  nft_change: number[];
  dapp_today: number[];
  dapp_change: number[];
  last_updated: Date;
}

export async function GET(): Promise<NextResponse> {
  let client: MongoClient | undefined;

  try {
    client = new MongoClient(process.env.MONGODB_URL as string, {
      useUnifiedTopology: true,
    } as MongoClientOptions);
    await client.connect();

    const db: Db = client.db('LFP');
    const collection: Collection<TrackerData> = db.collection('Tracker');

    const trackerData: TrackerData | null = await collection.findOne({ id: 'tracker_data' });

    if (!trackerData) {
      return NextResponse.json({ nft: [], dapp: [] });
    }

    return NextResponse.json({
      nft_today: trackerData.nft_today,
      nft_change: trackerData.nft_change,
      dapp_today: trackerData.dapp_today,
      dapp_change: trackerData.dapp_change,
      last_updated: trackerData.last_updated,
    });
  } catch (error: unknown) {
    console.error('Error fetching tracker data from MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracker data' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}