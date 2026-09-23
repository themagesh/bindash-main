import { NextResponse } from 'next/server';
import { getOpenOrders, getRecentTrades } from '@/lib/binance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'open';
    const symbol = searchParams.get('symbol');

    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
      return NextResponse.json({
        error: 'API keys not configured',
      }, { status: 401 });
    }

    let data;
    if (type === 'open' || type === 'pending') {
      data = await getOpenOrders(symbol);
    } else {
      data = await getRecentTrades(symbol || 'BTCUSDT');
    }

    return NextResponse.json({
      success: true,
      data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
