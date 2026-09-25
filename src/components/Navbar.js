'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ onRefresh, loading, progressData }) {
  const currentTradeNum = progressData?.currentTradeNum;
  const currentTradeStart = progressData?.currentTradeStart;
  const currentTradeProfit = progressData?.currentTradeProfit;
  const currentTradeEnd = progressData?.currentTradeEnd;
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Futures' },
    { href: '/spot', label: 'Spot' },
    { href: '/compound', label: 'Goal' },
    { href: '/trades', label: 'History' },
  ];

  const isActive = (href) => pathname === href;

  const MobileTradeSummary = () =>
    progressData?.currentTradeNum ? (
      <div className="md:hidden w-full px-4 py-3 z-30">
        <div className="rounded-2xl border border-pink-200 bg-white/80 p-3 shadow-[0_8px_20px_rgba(152,116,176,0.12)] backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-extrabold text-[#f27ab1]">Trade #{progressData.currentTradeNum}</span>
            <span className="ml-auto text-[12px] text-[#7b6a78] font-medium">Current</span>
          </div>
          <div className="mt-2 flex flex-col gap-1.5 text-sm text-[#5c4059]">
            <div className="flex items-center justify-between"><span>Start</span><span className="font-bold">${progressData.currentTradeStart?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
            <div className="flex items-center justify-between"><span>Target</span><span className={`font-bold ${progressData.currentTradeProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>${progressData.currentTradeProfit?.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>End</span><span className="font-bold text-[#685de6]">${progressData.currentTradeEnd?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <nav className="sticky top-0 z-40 px-2 sm:px-4 pt-3">
        <div className="max-w-[1360px] mx-auto">
          <div className="nav-cute rounded-[28px] px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 shadow-[0_8px_18px_rgba(255,167,83,0.3)]">
                <span className="cute-brand text-2xl leading-none text-[#f7b41a]">👑</span>
              </div>
              <div className="cute-brand text-[2rem] sm:text-[2.4rem] font-black text-[#f365b0] leading-none">Sweety</div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {navItems.map((item) => (
                isActive(item.href) ? (
                  <span key={item.href} className="nav-pill nav-pill--active">
                    {item.label}
                  </span>
                ) : (
                  <Link key={item.href} href={item.href} className="nav-pill nav-pill--ghost hover:translate-y-[-1px]">
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3 flex-1 justify-end min-w-0">
              {progressData && (
                <div className="flex min-w-0 max-w-[720px] flex-1 items-center gap-3 rounded-full border border-[#f4d3ea] bg-white/70 px-3 py-2 shadow-inner shadow-white/60">
                  <span className="text-[0.7rem] font-extrabold text-[#484c5c]">{(progressData?.tradesProgress || 0).toFixed(1)}%</span>
                  <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#f4e9f8]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#e7b6ff] via-[#f1a8d8] to-[#f4d353]"
                      style={{ width: `${Math.max(progressData?.tradesProgress || 0, 4)}%` }}
                    />
                  </div>
                  {currentTradeNum && (
                    <div className="flex shrink-0 items-center gap-2 border-l border-[#ebd7ea] pl-2 text-[0.68rem] text-[#5d4f6a]">
                      <span className="font-bold text-[#6b74ee]">Trade #{currentTradeNum}</span>
                      <span>Target <span className="font-extrabold text-[#5abf94]">+${currentTradeProfit?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0d4dd] bg-white/80 text-[#f27ab1] shadow-sm transition hover:scale-[1.02] disabled:opacity-60"
                  aria-label="Refresh"
                >
                  <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0d4dd] bg-white/80 text-[#7c5578] shadow-sm sm:hidden"
                aria-label="Open menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="sm:hidden pb-3 pt-2 animate-fadeIn">
              <div className="flex flex-col gap-2 rounded-2xl border border-pink-200 bg-white/80 p-2 shadow-[0_8px_20px_rgba(152,116,176,0.12)]">
                {navItems.map((item) => (
                  isActive(item.href) ? (
                    <span key={item.href} className="nav-pill nav-pill--active text-center">
                      {item.label}
                    </span>
                  ) : (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="nav-pill nav-pill--ghost text-center">
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
      <MobileTradeSummary />
    </>
  );
}
