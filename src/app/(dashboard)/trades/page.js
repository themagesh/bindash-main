'use client';

import { useState } from 'react';
import { useFetch, formatCurrency } from '@/lib/utils';

export default function TradesPage() {
  const [activeTab, setActiveTab] = useState('profits');
  const [period, setPeriod] = useState('day');
  
  // Fetch last 1000 trades to cover ~1 month
  const { data: trades, loading, error, refetch } = useFetch('/api/trades?type=pnl&limit=1000', { refreshInterval: 10000 });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const periods = {
    day: { label: '1 Day', description: 'Last 24 hours', duration: 24 * 60 * 60 * 1000 },
    week: { label: '1 Week', description: 'Last 7 days', duration: 7 * 24 * 60 * 60 * 1000 },
    month: { label: '1 Month', description: 'Last 30 days', duration: 30 * 24 * 60 * 60 * 1000 },
  };

  const selectedPeriod = periods[period];
  const now = new Date();
  const periodStart = now.getTime() - selectedPeriod.duration;
  const recentTrades = trades?.filter(t => t.timestamp >= periodStart) || [];

  // Group losses by symbol (cumulative)
  const lossesBySymbol = recentTrades
    .filter(t => t.income < 0)
    .reduce((acc, trade) => {
      const symbol = trade.symbol;
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          totalAmount: 0,
          tradeCount: 0,
          lastTrade: trade.timestamp
        };
      }
      acc[symbol].totalAmount += trade.income;
      acc[symbol].tradeCount++;
      if (trade.timestamp > acc[symbol].lastTrade) {
        acc[symbol].lastTrade = trade.timestamp;
      }
      return acc;
    }, {});

  // Group profits by symbol (cumulative)
  const profitsBySymbol = recentTrades
    .filter(t => t.income > 0)
    .reduce((acc, trade) => {
      const symbol = trade.symbol;
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          totalAmount: 0,
          tradeCount: 0,
          lastTrade: trade.timestamp
        };
      }
      acc[symbol].totalAmount += trade.income;
      acc[symbol].tradeCount++;
      if (trade.timestamp > acc[symbol].lastTrade) {
        acc[symbol].lastTrade = trade.timestamp;
      }
      return acc;
    }, {});

  // Convert to arrays and sort
  const lossesArray = Object.values(lossesBySymbol).sort((a, b) => a.totalAmount - b.totalAmount);
  const profitsArray = Object.values(profitsBySymbol).sort((a, b) => b.totalAmount - a.totalAmount);

  const totalLoss = lossesArray.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalProfit = profitsArray.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalLossTrades = lossesArray.reduce((sum, item) => sum + item.tradeCount, 0);
  const totalProfitTrades = profitsArray.reduce((sum, item) => sum + item.tradeCount, 0);
  const totalPnL = totalProfit + totalLoss;

  const currentArray = activeTab === 'losses' ? lossesArray : profitsArray;
  const currentTotal = activeTab === 'losses' ? totalLoss : totalProfit;
  const currentTotalTrades = activeTab === 'losses' ? totalLossTrades : totalProfitTrades;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {selectedPeriod.label} PnL by Coin
        </h1>
        <p className="text-gray-400 mt-1">{selectedPeriod.description} - cumulative per symbol</p>
      </div>

      {/* History Period */}
      <div className="flex gap-2 mb-6 rounded-xl border border-gray-700 bg-gray-800/50 p-1">
        {Object.entries(periods).map(([value, option]) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              period === value
                ? 'bg-[#fcd535] text-gray-900 shadow-md'
                : 'text-gray-400 hover:bg-gray-700/60 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs md:text-sm">Total Profit</p>
          <p className="text-lg md:text-xl font-bold text-green-400">
            +{formatCurrency(totalProfit)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs md:text-sm">Total Loss</p>
          <p className="text-lg md:text-xl font-bold text-red-400">
            {formatCurrency(totalLoss)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs md:text-sm">Net PnL</p>
          <p className={`text-lg md:text-xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-xs md:text-sm">Coins Traded</p>
          <p className="text-lg md:text-xl font-bold text-blue-400">
            {new Set([...lossesArray.map(l => l.symbol), ...profitsArray.map(p => p.symbol)]).size}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('profits')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'profits'
              ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
              : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>�</span>
            <span>Profits</span>
            <span className="bg-green-500/30 text-green-400 text-xs px-2 py-0.5 rounded-full">{profitsArray.length}</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('losses')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            activeTab === 'losses'
              ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
              : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>📉</span>
            <span>Losses</span>
            <span className="bg-red-500/30 text-red-400 text-xs px-2 py-0.5 rounded-full">{lossesArray.length}</span>
          </div>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Trades List */}
      {!loading && trades && (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              {activeTab === 'losses' ? '📉 Losses' : '📈 Profits'} by Coin ({selectedPeriod.description})
            </h2>
          </div>

          {currentArray.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {activeTab === 'losses' ? `No losses in the ${selectedPeriod.description.toLowerCase()} 🎉` : `No profits in the ${selectedPeriod.description.toLowerCase()}`}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block md:hidden divide-y divide-gray-700">
                {currentArray.map((item, index) => (
                  <div key={item.symbol} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">#{index + 1}</span>
                        <span className="text-white font-medium">{item.symbol}</span>
                      </div>
                      <span className={`font-bold ${activeTab === 'losses' ? 'text-red-400' : 'text-green-400'}`}>
                        {activeTab === 'profits' ? '+' : ''}{formatCurrency(item.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-end text-sm">
                      <span className="text-gray-500 text-xs">
                        Last: {formatDate(item.lastTrade)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Symbol</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">
                        {activeTab === 'losses' ? 'Cumulative Loss' : 'Cumulative Profit'}
                      </th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Last Trade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentArray.map((item, index) => (
                      <tr 
                        key={item.symbol} 
                        className="border-b border-gray-700/50 hover:bg-gray-700/30"
                      >
                        <td className="py-4 px-4 text-gray-500">{index + 1}</td>
                        <td className="py-4 px-4 text-white font-medium">{item.symbol}</td>
                        <td className={`py-4 px-4 text-right font-bold ${activeTab === 'losses' ? 'text-red-400' : 'text-green-400'}`}>
                          {activeTab === 'profits' ? '+' : ''}{formatCurrency(item.totalAmount)}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-400 text-sm">
                          {formatDate(item.lastTrade)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>
          Showing cumulative {activeTab} per coin for the last 24 hours
        </p>
      </div>
    </div>
  );
}
