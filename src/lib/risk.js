// Calculate risk metrics
export function calculateRiskMetrics(holdings, totalValue) {
  if (!holdings || holdings.length === 0) {
    return {
      diversificationScore: 0,
      largestPosition: 0,
      volatilityExposure: 'N/A',
      stablecoinRatio: 0,
      riskLevel: 'N/A',
    };
  }

  // Largest position concentration
  const largestPosition = holdings[0]?.allocation || 0;
  
  // Stablecoin ratio
  const stablecoins = ['USDT', 'USDC', 'BUSD', 'DAI', 'TUSD', 'FDUSD'];
  const stablecoinValue = holdings
    .filter(h => stablecoins.includes(h.currency))
    .reduce((sum, h) => sum + h.valueUSD, 0);
  const stablecoinRatio = totalValue > 0 ? (stablecoinValue / totalValue) * 100 : 0;
  
  // Diversification score (based on number of assets and distribution)
  const n = holdings.length;
  const hhi = holdings.reduce((sum, h) => sum + Math.pow(h.allocation / 100, 2), 0);
  const diversificationScore = n > 1 
    ? Math.min(100, ((1 - hhi) / (1 - 1/n)) * 100)
    : 0;
  
  // Volatility exposure (simplified based on asset types)
  const highVolatility = ['BTC', 'ETH', 'SOL', 'DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'];
  const highVolExposure = holdings
    .filter(h => highVolatility.includes(h.currency))
    .reduce((sum, h) => sum + h.allocation, 0);
  
  let volatilityExposure;
  if (highVolExposure > 70) volatilityExposure = 'High';
  else if (highVolExposure > 40) volatilityExposure = 'Medium';
  else volatilityExposure = 'Low';
  
  // Overall risk level
  let riskLevel;
  if (stablecoinRatio > 50) riskLevel = 'Conservative';
  else if (stablecoinRatio > 20 && largestPosition < 50) riskLevel = 'Moderate';
  else if (largestPosition > 70 || stablecoinRatio < 10) riskLevel = 'Aggressive';
  else riskLevel = 'Moderate';
  
  return {
    diversificationScore: diversificationScore.toFixed(1),
    largestPosition: largestPosition.toFixed(1),
    volatilityExposure,
    stablecoinRatio: stablecoinRatio.toFixed(1),
    riskLevel,
  };
}
