import { NextResponse } from 'next/server';
import { getFuturesTradeHistory, getFuturesClosedOrders } from '@/lib/binance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'orders'; // 'orders', 'pnl', or 'losses'

    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
      return NextResponse.json({
        error: 'API keys not configured',
      }, { status: 401 });
    }

    let data;
    if (type === 'pnl' || type === 'losses') {
      data = await getFuturesTradeHistory(limit);
    } else {
      data = await getFuturesClosedOrders(null, limit);
    }

    return NextResponse.json({
      success: true,
      data,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Trades API error:', error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
