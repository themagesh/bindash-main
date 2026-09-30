'use client';

import { formatCurrency, formatCurrencyFull, formatPercent } from '@/lib/utils';

export default function PositionDetails({ position, onClose }) {
  if (!position) return null;

  const fields = [
    ['Entry Price', formatCurrencyFull(position.entryPrice)],
    ['Current Price', formatCurrencyFull(position.markPrice)],
    ['Quantity', position.positionAmt],
    ['Leverage', `${position.leverage}x`],
    ['Margin', formatCurrency(position.isolatedMargin)],
    ['Liquidation Price', formatCurrencyFull(position.liquidationPrice)],
    ['Stop Loss', position.stopLossPrice ? formatCurrencyFull(position.stopLossPrice) : 'Not set'],
    ['Take Profit', position.takeProfitPrice ? formatCurrencyFull(position.takeProfitPrice) : 'Not set'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${position.symbol} position details`}>
      <button className="absolute inset-0 bg-[#13233b]/30 backdrop-blur-sm" onClick={onClose} aria-label="Close position details" />
      <aside className="position-details relative w-full max-w-md rounded-[26px] p-5 sm:p-6 shadow-2xl animate-fadeIn">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ed2d86]">Position details</p>
            <h2 className="mt-1 text-2xl font-black text-[#13233b]">{position.symbol.replace('USDT', '')}/USDT</h2>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${position.side === 'LONG' ? 'bg-[#b8eccb] text-[#17643a]' : 'bg-[#f3bfd7] text-[#9b1851]'}`}>{position.side}</span>
          </div>
          <button onClick={onClose} className="rounded-full bg-[#13233b]/10 px-3 py-1 text-xl text-[#13233b]" aria-label="Close">x</button>
        </div>

        <div className="mt-5 rounded-2xl bg-[#13233b] p-4 text-white">
          <p className="text-xs text-white/60">Unrealized PnL</p>
          <p className={`mt-1 text-3xl font-black ${position.unrealizedProfit >= 0 ? 'text-[#b8eccb]' : 'text-[#f3bfd7]'}`}>{formatCurrency(position.unrealizedProfit)}</p>
          <p className="mt-1 text-xs text-white/65">ROI {formatPercent(position.roe)}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {fields.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white/75 p-3">
              <p className="text-[11px] font-semibold text-[#617083]">{label}</p>
              <p className="mt-1 truncate text-sm font-bold text-[#13233b]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-[#abe5ed] p-4">
          <div className="flex items-center justify-between text-xs font-bold text-[#13233b]">
            <span>Price pulse</span><span>Live mark stream</span>
          </div>
          <div className="mt-4 flex h-14 items-end gap-1">
            {[32, 42, 35, 50, 44, 57, 49, 64, 58, 70, 63, 76].map((height, index) => <span key={index} className="flex-1 rounded-t-full bg-[#ed2d86]/70" style={{ height: `${height}%` }} />)}
          </div>
        </div>
      </aside>
    </div>
  );
}
