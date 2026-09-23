import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KV_KEY = 'compound_data';

export async function GET() {
  try {
    const data = await redis.get(KV_KEY);
    return NextResponse.json(data || { startingBalance: null, completedTrades: [] });
  } catch (error) {
    console.error('Redis GET error:', error);
    return NextResponse.json({ startingBalance: null, completedTrades: [] });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { startingBalance, completedTrades } = body;
    
    const data = {
      startingBalance,
      completedTrades: completedTrades || [],
      updatedAt: new Date().toISOString(),
    };
    
    await redis.set(KV_KEY, data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Redis POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await redis.del(KV_KEY);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redis DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
