<!-- Binance Dashboard Project Instructions -->

## Project Overview
This is a Binance Portfolio Risk Management Dashboard built with Next.js for Vercel deployment.

## Development

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## Configuration

### Environment Variables
Add these to your `.env.local` file (local) or Vercel dashboard (production):
- `BINANCE_API_KEY` - Your Binance API key
- `BINANCE_API_SECRET` - Your Binance API secret
- `BINANCE_TESTNET` - Set to `true` for testnet mode

## Key Files

### API Routes
- `src/app/api/portfolio/route.js` - Portfolio data endpoint
- `src/app/api/prices/route.js` - Price data endpoint
- `src/app/api/orders/route.js` - Orders endpoint
- `src/app/api/futures/route.js` - Futures positions and account endpoint

### Libraries
- `src/lib/binance.js` - Binance API integration (Spot + Futures)
- `src/lib/risk.js` - Risk metrics calculations
- `src/lib/utils.js` - Utility functions and hooks

### Components
- `src/components/AllocationChart.js` - Pie chart for portfolio allocation
- `src/components/HoldingsTable.js` - Table of asset holdings
- `src/components/RiskMetrics.js` - Risk analysis cards
- `src/components/PortfolioHeader.js` - Header with total value
- `src/components/OpenOrders.js` - Open orders display
- `src/components/FuturesPositions.js` - Futures positions table
- `src/components/FuturesRiskMetrics.js` - Futures risk metrics cards
- `src/components/ApiKeySetup.js` - Demo mode instructions
- `src/components/LoadingSpinner.js` - Loading component

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
