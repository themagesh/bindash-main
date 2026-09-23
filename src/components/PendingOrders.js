'use client';

import { useState, useEffect, useCallback } from 'react';

export default function PendingOrders({ onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingId, setCancelingId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/futures?type=orders');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      setOrders(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // No auto-polling - user must click to refresh
  }, [fetchOrders]);

  const handleCancel = async (symbol, orderId) => {
    if (!confirm(`Cancel order ${orderId} for ${symbol}?`)) return;
    
    setCancelingId(orderId);
    try {
      const response = await fetch('/api/futures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancelOrder',
          symbol,
          orderId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel order');
      }

      // Refresh orders after cancel
      fetchOrders();
      if (onRefresh) onRefresh();
    } catch (error) {
      alert('Failed to cancel order: ' + error.message);
    } finally {
      setCancelingId(null);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const formatQuantity = (qty) => {
    return parseFloat(qty).toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 6,
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter for limit orders only (pending orders)
  const limitOrders = orders.filter(order => 
    order.type === 'LIMIT' || order.type === 'STOP' || order.type === 'STOP_MARKET' || order.type === 'TAKE_PROFIT' || order.type === 'TAKE_PROFIT_MARKET'
  );

  if (loading) {
    return (
      <section className="bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-white">Pending Limit Orders</h2>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-white">Pending Limit Orders</h2>
          <button
            onClick={fetchOrders}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-center py-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (limitOrders.length === 0) {
    return (
      <section className="bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-white">Pending Limit Orders</h2>
          <button
            onClick={fetchOrders}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
        <div className="text-center py-4">
          <p className="text-gray-400">No pending limit orders</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Pending Limit Orders ({limitOrders.length})
        </h2>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-2 px-2">Symbol</th>
              <th className="text-left py-2 px-2">Type</th>
              <th className="text-left py-2 px-2">Side</th>
              <th className="text-right py-2 px-2">Price</th>
              <th className="text-right py-2 px-2">Quantity</th>
              <th className="text-right py-2 px-2">Filled</th>
              <th className="text-left py-2 px-2">Time</th>
              <th className="text-center py-2 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {limitOrders.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="py-2 px-2 font-medium text-white">
                  {order.symbol.replace('USDT', '')}
                </td>
                <td className="py-2 px-2 text-gray-300 text-xs">
                  {order.type.replace('_', ' ')}
                </td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    order.side === 'BUY' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {order.side}
                  </span>
                </td>
                <td className="py-2 px-2 text-right text-white">
                  ${formatPrice(order.price || order.stopPrice)}
                </td>
                <td className="py-2 px-2 text-right text-gray-300">
                  {formatQuantity(order.origQty)}
                </td>
                <td className="py-2 px-2 text-right text-gray-400">
                  {formatQuantity(order.executedQty)} ({((order.executedQty / order.origQty) * 100).toFixed(0)}%)
                </td>
                <td className="py-2 px-2 text-gray-400 text-xs">
                  {formatTime(order.time)}
                </td>
                <td className="py-2 px-2 text-center">
                  <button
                    onClick={() => handleCancel(order.symbol, order.orderId)}
                    disabled={cancelingId === order.orderId}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {cancelingId === order.orderId ? 'Canceling...' : 'Cancel'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {limitOrders.map((order) => (
          <div key={order.orderId} className="bg-gray-700/30 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-medium text-white">{order.symbol.replace('USDT', '')}</span>
                <span className="text-gray-400 text-xs ml-2">{order.type.replace('_', ' ')}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                order.side === 'BUY' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {order.side}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-400">Price:</span>
                <span className="text-white ml-1">${formatPrice(order.price || order.stopPrice)}</span>
              </div>
              <div>
                <span className="text-gray-400">Qty:</span>
                <span className="text-gray-300 ml-1">{formatQuantity(order.origQty)}</span>
              </div>
              <div>
                <span className="text-gray-400">Filled:</span>
                <span className="text-gray-300 ml-1">{((order.executedQty / order.origQty) * 100).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs">{formatTime(order.time)}</span>
              </div>
            </div>
            
            <button
              onClick={() => handleCancel(order.symbol, order.orderId)}
              disabled={cancelingId === order.orderId}
              className="w-full py-2 bg-red-500/20 text-red-400 rounded text-sm font-medium hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelingId === order.orderId ? 'Canceling...' : 'Cancel Order'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
