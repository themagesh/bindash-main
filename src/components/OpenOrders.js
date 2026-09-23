'use client';

import { formatCurrency } from '@/lib/utils';

export default function OpenOrders({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        No open orders
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {orders.map((order) => (
          <div 
            key={order.id}
            className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{order.symbol}</span>
              <span className={`font-medium capitalize px-2 py-0.5 rounded text-sm ${
                order.side === 'buy' 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {order.side}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-gray-300 ml-1 capitalize">{order.type}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Price:</span>
                <span className="text-gray-300 ml-1">{formatCurrency(order.price)}</span>
              </div>
              <div>
                <span className="text-gray-400">Amount:</span>
                <span className="text-gray-300 ml-1">{order.amount}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400">Total:</span>
                <span className="text-white font-medium ml-1">{formatCurrency(Math.abs(Math.round(order.price * order.amount)), 0)}</span>
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
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Pair</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Type</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Side</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Price</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id} 
                className="border-b border-gray-800 hover:bg-gray-800/50"
              >
                <td className="py-3 px-4 text-white font-medium">{order.symbol}</td>
                <td className="py-3 px-4 text-gray-300 capitalize">{order.type}</td>
                <td className={`py-3 px-4 font-medium capitalize ${
                  order.side === 'buy' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {order.side}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {formatCurrency(order.price)}
                </td>
                <td className="py-3 px-4 text-right text-gray-300">{order.amount}</td>
                <td className="py-3 px-4 text-right text-white font-medium">
                  {formatCurrency(Math.abs(Math.round(order.price * order.amount)), 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
