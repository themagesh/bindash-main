'use client';

import { getRiskColor } from '@/lib/utils';

export default function RiskMetrics({ metrics }) {
  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No risk data available
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Risk Level',
      value: metrics.riskLevel,
      description: 'Overall portfolio risk assessment',
      isRisk: true,
      background: 'linear-gradient(135deg, #f2c9d4 0%, #f7c7e0 100%)',
    },
    {
      label: 'Diversification Score',
      value: `${metrics.diversificationScore}%`,
      description: 'Higher is better (0-100)',
      color: parseFloat(metrics.diversificationScore) > 50 ? 'text-green-700' : 'text-yellow-700',
      background: 'linear-gradient(135deg, #d8f5de 0%, #c0f0d0 100%)',
    },
    {
      label: 'Largest Position',
      value: `${metrics.largestPosition}%`,
      description: 'Concentration in top asset',
      color: parseFloat(metrics.largestPosition) > 50 ? 'text-red-500' : 'text-green-700',
      background: 'linear-gradient(135deg, #f7e8bf 0%, #f5d39e 100%)',
    },
    {
      label: 'Stablecoin Ratio',
      value: `${metrics.stablecoinRatio}%`,
      description: 'Stable assets allocation',
      color: 'text-blue-700',
      background: 'linear-gradient(135deg, #d8ecff 0%, #c2dfff 100%)',
    },
    {
      label: 'Volatility Exposure',
      value: metrics.volatilityExposure,
      description: 'High-volatility asset exposure',
      color: metrics.volatilityExposure === 'High' ? 'text-red-500' :
        metrics.volatilityExposure === 'Medium' ? 'text-yellow-700' : 'text-green-700',
      background: 'linear-gradient(135deg, #eeddff 0%, #d7c5ff 100%)',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
      {metricCards.map((metric, index) => (
        <div key={index} className="metric-card" style={{ background: metric.background }}>
          <p className="mb-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#5c4f7d]">{metric.label}</p>
          <p className={`text-lg md:text-xl font-black ${metric.isRisk ? getRiskColor(metric.value).split(' ')[0] : metric.color}`}>
            {metric.value}
          </p>
          <p className="mt-2 text-[0.72rem] font-semibold text-[#675b71] hidden sm:block">{metric.description}</p>
        </div>
      ))}
    </div>
  );
}
