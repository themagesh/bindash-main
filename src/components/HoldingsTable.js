'use client';

import { formatCurrency, formatNumber, formatPercent, getChangeColor } from '@/lib/utils';

export default function HoldingsTable({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No holdings found
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {holdings.map((holding) => (
          <div 
            key={holding.currency}
            className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {holding.currency.slice(0, 2)}
                </div>
                <span className="font-medium text-white">{holding.currency}</span>
              </div>
              <span className={`font-medium ${getChangeColor(holding.change24h)}`}>
                {formatPercent(holding.change24h)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Amount:</span>
                <span className="text-gray-300 ml-1">{formatNumber(holding.amount, holding.amount < 1 ? 6 : 4)}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Price:</span>
                <span className="text-gray-300 ml-1">{formatCurrency(holding.price, holding.price < 1 ? 4 : 2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Value:</span>
                <span className="text-white font-medium ml-1">{formatCurrency(holding.valueUSD)}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Alloc:</span>
                <span className="text-gray-300 ml-1">{formatNumber(holding.allocation, 1)}%</span>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(holding.allocation, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Asset</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Amount</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Price</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">24h Change</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Value</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr 
                key={holding.currency} 
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {holding.currency.slice(0, 2)}
                    </div>
                    <span className="font-medium text-white">{holding.currency}</span>
                  </div>
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  {formatNumber(holding.amount, holding.amount < 1 ? 6 : 4)}
                </td>
                <td className="text-right py-4 px-4 text-gray-300">
                  {formatCurrency(holding.price, holding.price < 1 ? 4 : 2)}
                </td>
                <td className={`text-right py-4 px-4 font-medium ${getChangeColor(holding.change24h)}`}>
                  {formatPercent(holding.change24h)}
                </td>
                <td className="text-right py-4 px-4 text-white font-medium">
                  {formatCurrency(holding.valueUSD)}
                </td>
                <td className="text-right py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(holding.allocation, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-300 text-sm w-12 text-right">
                      {formatNumber(holding.allocation, 1)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
