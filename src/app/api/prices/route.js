import { NextResponse } from 'next/server';
import { get24hrTickers } from '@/lib/binance';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    const symbols = symbolsParam 
      ? symbolsParam.split(',').map(s => s.replace('/', '')) 
      : ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

    const prices = await get24hrTickers(symbols);

    return NextResponse.json({
      success: true,
      data: prices,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Prices API error:', error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
