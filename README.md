# Binance Portfolio Risk Dashboard

A real-time portfolio risk management dashboard for Binance, built with Next.js and designed for Vercel deployment.

## Features

- **Portfolio Overview**: View total portfolio value and asset holdings
- **Risk Analysis**: 
  - Diversification score
  - Largest position concentration
  - Stablecoin ratio
  - Volatility exposure assessment
  - Overall risk level classification
- **Holdings Table**: Detailed view of all assets with prices, 24h changes, and allocation percentages
- **Allocation Chart**: Visual pie chart of portfolio distribution
- **Open Orders**: View pending limit orders
- **Demo Mode**: Works without API keys using sample data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Binance account with API access (optional for demo mode)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bindash
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Add your Binance API keys to `.env.local`:
```env
BINANCE_API_KEY=your_api_key_here
BINANCE_API_SECRET=your_api_secret_here
BINANCE_TESTNET=false
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Key Setup

1. Go to [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Create a new API key
3. **Important Security Settings**:
   - Enable only "Read" permissions (no trading access needed)
   - Restrict IP access to your server's IP address
   - Never share your API secret

## Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bindash)

### Manual Deployment

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. Add Environment Variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add the following:
     - `BINANCE_API_KEY`: Your Binance API key
     - `BINANCE_API_SECRET`: Your Binance API secret
     - `BINANCE_TESTNET`: `false` (or `true` for testnet)

4. Deploy!

## Project Structure

```
bindash/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── portfolio/route.js   # Portfolio data endpoint
│   │   │   ├── prices/route.js      # Price data endpoint
│   │   │   └── orders/route.js      # Orders endpoint
│   │   ├── layout.js
│   │   ├── page.js                  # Main dashboard
│   │   └── globals.css
│   ├── components/
│   │   ├── AllocationChart.js       # Portfolio pie chart
│   │   ├── ApiKeySetup.js           # Demo mode instructions
│   │   ├── HoldingsTable.js         # Holdings data table
│   │   ├── LoadingSpinner.js        # Loading component
│   │   ├── OpenOrders.js            # Open orders table
│   │   ├── PortfolioHeader.js       # Header with total value
│   │   └── RiskMetrics.js           # Risk analysis cards
│   └── lib/
│       ├── binance.js               # Binance API integration
│       └── utils.js                 # Utility functions
├── vercel.json                      # Vercel configuration
├── .env.example                     # Environment template
└── README.md
```

## Risk Metrics Explained

| Metric | Description |
|--------|-------------|
| **Risk Level** | Overall assessment: Conservative, Moderate, or Aggressive |
| **Diversification Score** | 0-100 scale based on asset distribution (higher = better) |
| **Largest Position** | Percentage of portfolio in the top holding |
| **Stablecoin Ratio** | Percentage held in stablecoins (USDT, USDC, etc.) |
| **Volatility Exposure** | High/Medium/Low based on volatile asset holdings |

## Security Considerations

- API keys are stored as environment variables, never in code
- Read-only API permissions are sufficient for this dashboard
- No trading functionality - view only
- Environment files are gitignored by default

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Binance API**: CCXT library
- **Deployment**: Vercel

## License

MIT License - feel free to use and modify for your own projects.
