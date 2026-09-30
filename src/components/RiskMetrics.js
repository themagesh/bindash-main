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
    },
    {
      label: 'Diversification Score',
      value: `${metrics.diversificationScore}%`,
      description: 'Higher is better (0-100)',
      color: parseFloat(metrics.diversificationScore) > 50 ? 'text-green-500' : 'text-yellow-500',
    },
    {
      label: 'Largest Position',
      value: `${metrics.largestPosition}%`,
      description: 'Concentration in top asset',
      color: parseFloat(metrics.largestPosition) > 50 ? 'text-red-500' : 'text-green-500',
    },
    {
      label: 'Stablecoin Ratio',
      value: `${metrics.stablecoinRatio}%`,
      description: 'Stable assets allocation',
      color: 'text-blue-500',
    },
    {
      label: 'Volatility Exposure',
      value: metrics.volatilityExposure,
      description: 'High-volatility asset exposure',
      color: metrics.volatilityExposure === 'High' ? 'text-red-500' : 
             metrics.volatilityExposure === 'Medium' ? 'text-yellow-500' : 'text-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
      {metricCards.map((metric, index) => (
        <div key={index} className="bg-gray-800/50 rounded-xl p-3 md:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs md:text-sm mb-1">{metric.label}</p>
          <p className={`text-lg md:text-xl font-bold ${metric.isRisk ? getRiskColor(metric.value).split(' ')[0] : metric.color}`}>
            {metric.value}
          </p>
          <p className="text-gray-500 text-xs mt-1 hidden sm:block">{metric.description}</p>
        </div>
      ))}
    </div>
  );
}
