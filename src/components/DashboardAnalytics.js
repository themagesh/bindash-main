'use client';

import { formatCurrency } from '@/lib/utils';

function Sparkline({ values, color }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - ((value - min) / (max - min || 1)) * 80 - 10}`).join(' ');
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full"><polyline points={points} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function DashboardAnalytics({ balance, pnl, longExposure, shortExposure, target }) {
  const progress = Math.min(Math.max((balance / target) * 100, 0), 100);
  return (
    <section className="analytics-grid mt-2 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
      <div className="analytics-card rounded-[24px] bg-[#fffdf7] p-5">
        <div className="flex items-start justify-between"><div><p className="eyebrow">Balance history</p><h2 className="analytics-title">A steady climb</h2></div><span className="doodle-chip">LIVE</span></div>
        <Sparkline values={[42, 47, 45, 51, 49, 58, 61, 59, 65, 68, 72, balance / 10]} color="#ed2d86" />
        <div className="flex justify-between text-xs text-[#617083]"><span>24h ago</span><strong className="text-[#13233b]">{formatCurrency(balance)}</strong><span>now</span></div>
      </div>
      <div className="analytics-card rounded-[24px] bg-[#d7c9f4] p-5"><p className="eyebrow">PnL pulse</p><h2 className={`analytics-title ${pnl < 0 ? 'text-[#9b1851]' : 'text-[#17643a]'}`}>{formatCurrency(pnl)}</h2><Sparkline values={[2, -1, 4, 3, -4, 1, -2, 3, pnl / 10]} color={pnl < 0 ? '#9b1851' : '#17643a'} /><p className="text-xs text-[#617083]">Current unrealized performance</p></div>
      <div className="analytics-card rounded-[24px] bg-[#b8eccb] p-5"><p className="eyebrow">Goal tracker</p><div className="mt-2 flex items-end justify-between"><h2 className="analytics-title">{progress.toFixed(2)}%</h2><span className="text-xs font-bold text-[#17643a]">{formatCurrency(target)} target</span></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-white/65"><div className="h-full rounded-full bg-[#ed2d86] transition-all duration-700" style={{ width: `${Math.max(progress, 1)}%` }} /></div><div className="mt-4 flex justify-between text-xs text-[#617083]"><span>Long {formatCurrency(longExposure, 0)}</span><span>Short {formatCurrency(shortExposure, 0)}</span></div></div>
    </section>
  );
}
