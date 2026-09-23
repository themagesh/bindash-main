
'use client';

import { useState } from 'react';
import { formatCurrency, formatCurrencyFull, formatPercent, getChangeColor } from '@/lib/utils';

// Accept pendingOrders prop
export default function FuturesPositions({ positions, onRefresh, pendingOrders = [] }) {
  const [closing, setClosing] = useState(null);

  const handleForceClose = async (position) => {
    if (!confirm(`Are you sure you want to force close ${position.symbol} ${position.side} position?`)) {
      return;
    }

    setClosing(position.symbol);
    try {
      const response = await fetch('/api/futures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'closePosition',
          symbol: position.symbol,
          side: position.side,
          quantity: Math.abs(parseFloat(position.positionAmt)),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to close position');
      }

      alert(`Position closed successfully!`);
      if (onRefresh) onRefresh();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setClosing(null);
    }
  };

  if ((!positions || positions.length === 0) && (!pendingOrders || pendingOrders.length === 0)) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No open futures positions or pending limit orders
      </div>
    );
  }
      {/* Pending Limit Orders - Mobile Card View */}
      {pendingOrders.length > 0 && (
        <div className="block md:hidden space-y-4 mt-6">
          {pendingOrders.map((order, idx) => (
            <div key={`pending-mobile-${order.orderId || idx}`} className="bg-gray-900 rounded-lg p-4 border border-yellow-700">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-medium text-yellow-300 text-lg">{order.symbol}</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400">Pending</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">Limit</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Side</span>
                  <p className="text-white">{order.side}</p>
                </div>
                <div>
                  <span className="text-gray-400">Price</span>
                  <p className="text-white">{formatCurrency(order.price)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Quantity</span>
                  <p className="text-white">{order.origQty}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status</span>
                  <p className="text-white">{order.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
            {/* Pending Limit Orders - Desktop Table View */}
            {pendingOrders.length > 0 && (
              <tr className="bg-yellow-900">
                <td colSpan="11" className="py-2 px-4 text-yellow-300 font-bold text-left border-t border-yellow-700">
                  Pending Limit Orders
                </td>
              </tr>
            )}
            {pendingOrders.length > 0 && pendingOrders.map((order, idx) => (
              <tr key={`pending-desktop-${order.orderId || idx}`} className="border-b border-yellow-700 bg-yellow-900/30">
                <td className="py-4 px-4 text-right text-yellow-200">-</td>
                <td className="py-4 px-4 text-right text-yellow-200">-</td>
                <td className="py-4 px-4 text-right text-yellow-200">-</td>
                <td className="py-4 px-4 text-right text-yellow-200">-</td>
                <td className="py-4 px-4 text-right text-yellow-200">-</td>
                <td className="py-4 px-4 text-center">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400">Limit</span>
                </td>
                <td className="border-l border-yellow-700 py-4 px-4 text-shadow-lg/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="font-medium text-yellow-300 text-lg">{order.symbol.replace(/USDT$/, '')}</span>
                  </div>
                </td>
                <td className="border-l border-yellow-700 py-4 px-4 text-right font-bold font-medium font-mono text-shadow-2xs text-shadow-gray-600 text-yellow-300">
                  <div>{order.side}</div>
                </td>
                <td className="border-l border-yellow-700 py-4 px-4 text-right font-bold font-mono text-yellow-300">
                  {order.status}
                </td>
                <td className="border-l border-yellow-700 py-4 px-4 text-right text-yellow-200">
                  {formatCurrency(order.price)}
                </td>
                <td className="py-4 px-2 text-center">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400">Pending</span>
                </td>
              </tr>
            ))}

  // Sort positions by total USDT size (desc)
  const sortedPositions = [...positions].sort((a, b) => {
    const aSize = Math.abs(a.positionAmt * a.entryPrice);
    const bSize = Math.abs(b.positionAmt * b.entryPrice);
    return bSize - aSize;
  });

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {sortedPositions.map((position, index) => (
          <div 
            key={`mobile-${position.symbol}-${index}`}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${position.side === 'LONG' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium text-white text-lg">{position.symbol}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  position.side === 'LONG' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {position.side}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  position.leverage >= 20 ? 'bg-red-500/20 text-red-400' :
                  position.leverage >= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {position.leverage}x
                </span>
              </div>
              <button
                onClick={() => handleForceClose(position)}
                disabled={closing === position.symbol}
                className="p-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition-colors"
                title="Force Close"
              >
                {closing === position.symbol ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Size</span>
                <p className="text-white">{position.positionAmt}</p>
              </div>
              <div>
                <span className="text-gray-400">Entry</span>
                <p className="text-white">
                  {formatCurrencyFull(position.entryPrice)}
                  <span className="text-xs text-blue-400 ml-2">(
                    ${Math.round(Math.abs(position.positionAmt * position.entryPrice)).toLocaleString('en-US')}
                  )</span>
                </p>
              </div>
              <div>
                <span className="text-gray-400">Target</span>
                {position.takeProfitPrice ? (
                  <p className="text-green-400">
                    {formatCurrencyFull(position.takeProfitPrice)}
                    <span className="text-green-400 text-xs ml-1">({formatCurrencyFull(position.takeProfitValue)})</span>
                  </p>
                ) : (
                  <p className="text-gray-500">No Target</p>
                )}
              </div>
              <div>
                <span className="text-gray-400">Mark</span>
                <p className="text-white">{formatCurrencyFull(position.markPrice)}</p>
              </div>
              <div>
                <span className="text-gray-400">PnL</span>
                <p className={`font-medium ${getChangeColor(position.unrealizedProfit)}`}>
                  {formatCurrency(Number(position.unrealizedProfit).toFixed(2), 2)} ({formatPercent(Number(position.roe).toFixed(2), 2)})
                </p>
              </div>
              <div>
                <span className="text-gray-400">Stop Loss</span>
                {position.stopLossPrice ? (
                    <p className={
                      position.stopLossPrice > position.entryPrice
                        ? "text-green-400"
                        : "text-yellow-400"
                    }>
                      {formatCurrencyFull(position.stopLossPrice)}
                      <span className={
                        position.stopLossPrice > position.entryPrice
                          ? "text-green-400 text-xs ml-1"
                          : "text-red-400 text-xs ml-1"
                      }>
                        ({formatCurrencyFull(Math.abs(position.stopLossValue))})
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-500">No SL</p>
                  )}
              </div>
              <div>
                <span className="text-gray-400">Liq. Price</span>
                <p className="text-orange-400">{formatCurrencyFull(position.liquidationPrice)}</p>
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
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Entry Price</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Mark Price</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Target</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Stop Loss</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Liq. Price</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Leverage</th>
              <th className="border-l border-gray-700 text-left py-3 px-4 text-gray-400 font-medium text-sm">Symbol</th>
              <th className=" text-right py-3 px-4 text-gray-400 font-medium text-sm">PnL</th>
              <th className=" text-right py-3 px-4 text-gray-400 font-medium text-sm">PnL (INR)</th>
              <th className=" text-right py-3 px-4 text-gray-400 font-medium text-sm">USDT</th>
              <th className="text-center py-3 px-2 text-gray-400 font-medium text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {sortedPositions.map((position, index) => (
              <tr 
                key={`${position.symbol}-${index}`}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4 text-right text-gray-300">
                  {formatCurrency(position.entryPrice, 4).replace('$', '')}
                </td>
                <td className="py-4 px-4 text-right text-gray-300">
                  {formatCurrency(position.markPrice, 4).replace('$', '')}
                </td>
                <td className="py-4 px-4 text-right">
                  {position.takeProfitPrice ? (
                    <div>
                      <div className="text-gray-300 text-xs">{formatCurrency(position.takeProfitPrice, 4).replace('$', '')}</div>
                      <div className=" text-green-500 font-medium text-md ">
                        {formatCurrency(position.takeProfitValue, 0).replace('$', '')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">No Target</span>
                  )}
                </td>
                <td className="py-4 px-4 text-right">
                  {position.stopLossPrice ? (
                      <div>
                        <div className={ "text-gray-300 text-xs"
                        }>
                          {formatCurrency(position.stopLossPrice, 4).replace('$', '')}
                        </div>
                        <div className={
                          position.side === 'SHORT'
                            ? (position.stopLossPrice > position.entryPrice
                                ? "text-red-500 text-md font-medium"
                                : "text-green-400 text-md font-medium")
                            : (position.stopLossPrice > position.entryPrice
                                ? "text-green-400 text-md font-medium"
                                : "text-red-500 text-md font-medium")
                        }>
                          {formatCurrency(Math.abs(position.stopLossValue), 0).replace('$', '')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No SL</span>
                    )}
                </td>
                <td className="py-4 px-4 text-right text-blue-400">
                  {formatCurrency(position.liquidationPrice, 4).replace('$', '')}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    position.leverage >= 20 ? 'bg-red-500/20 text-red-400' :
                    position.leverage >= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {position.leverage}x
                  </span>
                </td>
                <td className="border-l border-gray-700 py-4 px-4 text-shadow-lg/30">
                  <div className="flex items-center gap-2 ">
                    <div className={`w-2 h-2 rounded-full ${position.side === 'LONG' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium text-yellow-400 text-lg">{position.symbol.replace(/USDT$/, '')}</span>
                  </div>
                </td>
                <td className={`text-lg border-l border-gray-700 py-4 px-4 text-right font-bold font-medium font-mono text-shadow-2xs text-shadow-gray-600 ${getChangeColor(position.unrealizedProfit)}`}> 
                  <div>{Number(Math.abs(position.unrealizedProfit)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-sm opacity-40">
                    {Number(position.roe).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                  </div>
                </td>
                <td className={`border-l border-gray-700 py-4 px-4 text-right font-bold font-mono text-lg ${Number(position.unrealizedProfit) >= 0 ? 'text-green-400' : 'text-red-400'}`}> 
                  {(() => {
                    const inr = Math.abs(Number(position.unrealizedProfit) * 97);
                    return inr.toLocaleString('en-IN', { maximumFractionDigits: 0 });
                  })()}
                </td>
                <td className="border-l border-gray-700 py-4 px-4 text-right text-orange-200 ">
                  {(() => {
                    const value = Math.round(Math.abs(position.positionAmt * position.entryPrice));
                    if (value >= 1000) {
                      return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
                    }
                    return value;
                  })()}
                </td>
                <td className="py-4 px-2 text-center">
                  <button
                    onClick={() => handleForceClose(position)}
                    disabled={closing === position.symbol}
                    className="p-0.4 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 text-blue-800 rounded transition-colors border border-gray-400"
                    title="Force Close"
                  >
                    {closing === position.symbol ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Open Entry Orders - Desktop Table View */}
      {pendingOrders && pendingOrders.length > 0 && pendingOrders.filter(order => order.type?.toUpperCase() === 'LIMIT').length > 0 && (
        <div className="hidden md:block overflow-x-auto mt-2">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-700">
                <th className="text-left py-3 px-4 text-blue-400 font-medium text-sm">Symbol</th>
                <th className="text-left py-3 px-4 text-blue-400 font-medium text-sm">Position Value</th>
                <th className="text-left py-3 px-4 text-blue-400 font-medium text-sm">Entry Price</th>
                <th className="text-left py-3 px-4 text-blue-400 font-medium text-sm">Force Close</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.filter(order => order.type?.toUpperCase() === 'LIMIT').map((order, idx) => (
                <tr key={`open-entry-${order.orderId || idx}`} className="border-b border-blue-700 bg-blue-900/30">
                  <td className="py-3 px-4 text-blue-200">
                    {order.symbol}
                    <span className={`ml-2 px-2 py-0.5 rounded text-md font-semibold ${order.side === 'buy' ?   'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{order.side}</span>
                  </td>
                  <td className="py-3 px-4 text-blue-200">{(order.amount * order.price).toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                  <td className="py-3 px-4 text-blue-200">{order.price}</td>
                  <td className="py-3 px-4 text-blue-200">
                    <button
                      className="bg-red-400 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
                      onClick={() => handleForceClose(order)}
                    >X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </>
  );
}
/// Desktop Table View for Open Entry Orders (Pending Limit Orders)