import { NextResponse } from 'next/server';
import { 
  getAccountBalance, 
  calculatePortfolioValue,
} from '@/lib/binance';
import { calculateRiskMetrics } from '@/lib/risk';

export async function GET() {
  try {
    if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
      return NextResponse.json({
        error: 'API keys not configured. Please add BINANCE_API_KEY and BINANCE_API_SECRET to your environment variables.',
      }, { status: 401 });
    }

    const balances = await getAccountBalance();
    const { totalValue, holdings } = await calculatePortfolioValue(balances);
    const riskMetrics = calculateRiskMetrics(holdings, totalValue);

    return NextResponse.json({
      success: true,
      data: {
        totalValue,
        holdings,
        riskMetrics,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
