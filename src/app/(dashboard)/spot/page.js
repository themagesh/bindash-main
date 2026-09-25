'use client';

import { useState, useEffect } from 'react';
import { useFetch, formatCurrency } from '@/lib/utils';
import RiskMetrics from '@/components/RiskMetrics';
import HoldingsTable from '@/components/HoldingsTable';
import AllocationChart from '@/components/AllocationChart';
import OpenOrders from '@/components/OpenOrders';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SpotPage() {
  const [displayError, setDisplayError] = useState(null);
  const REFRESH_INTERVAL = 10000;

  const {
    data: portfolioData,
    loading: portfolioLoading,
    error: portfolioError,
    apiWeight,
  } = useFetch('/api/portfolio', { refreshInterval: REFRESH_INTERVAL });

  const {
    data: ordersData,
    loading: ordersLoading,
  } = useFetch('/api/orders?type=open', { refreshInterval: REFRESH_INTERVAL });

  useEffect(() => {
    if (portfolioError) {
      setDisplayError(portfolioError);
    } else if (displayError) {
      const timer = setTimeout(() => setDisplayError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [portfolioError, displayError]);

  if (portfolioLoading && !portfolioData) {
    return <LoadingSpinner text="Loading spot portfolio..." />;
  }

  const { totalValue, holdings, riskMetrics, lastUpdated } = portfolioData || {};
  const totalBalance = Number(totalValue || 0);

  return (
    <div className="dashboard-surface max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="cute-card card-soft-yellow flex-1 min-h-[180px] p-4 md:p-5">
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#534b2d]">Current Balance</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-xl shadow-inner">💰</div>
              </div>

              <div>
                <p className="money-value text-[2.25rem] md:text-[3.5rem] leading-none text-[#1f1f1f]">
                  {formatCurrency(totalBalance, 2)}
                </p>
                <div className="score-pill mt-3 bg-[#f9f3d2]/80 text-[#0d8a5e]">
                  <span>↓</span>
                  <span>Updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'now'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cute-card card-soft-cream flex-1 min-h-[180px] p-4 md:p-5">
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#534b2d]">Target</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-xl shadow-inner">🎯</div>
              </div>

              <p className="money-value text-left text-[2rem] md:text-[3rem] text-[#1d2433]">
                $100,000
              </p>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-3">
            <div className="cute-card card-soft-blue p-3 md:p-4">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#4f597e]">Wallet</p>
              <p className="money-value mt-3 text-[1.1rem] md:text-[1.7rem] text-[#1f2d4a]">
                {formatCurrency(totalBalance * 0.8 || 0, 2)}
              </p>
            </div>
            <div className="cute-card card-soft-violet p-3 md:p-4">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#4d3f79]">Margin</p>
              <p className="money-value mt-3 text-[1.1rem] md:text-[1.7rem] text-[#2e1a4b]">
                {formatCurrency(totalBalance * 0.62 || 0, 2)}
              </p>
            </div>
            <div className="cute-card card-soft-pink p-3 md:p-4">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#70475d]">PnL</p>
              <p className="money-value mt-3 text-[1.1rem] md:text-[1.7rem] text-[#d64053]">
                +{formatCurrency(totalBalance * 0.08 || 0, 2)}
              </p>
            </div>
          </div>
        </div>

        {apiWeight !== null && (
          <div className="flex items-center gap-3 rounded-full border border-[#f1d1e4] bg-[#fffafc]/80 px-4 py-3 shadow-[0_8px_18px_rgba(187,138,173,0.08)]">
            <div className="flex items-center gap-2 text-[0.75rem] font-bold text-[#6a4b63]">
              <span>API Weight</span>
              <span className="rounded-full bg-[#f5d6ea] px-2 py-0.5 text-[#5c4d6d]">{apiWeight}/1200</span>
            </div>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[#f0e8f4]">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${apiWeight > 1000 ? 'bg-[#f75d7d]' : apiWeight > 600 ? 'bg-[#ffbf66]' : 'bg-[#7fd6aa]'}`}
                style={{ width: `${Math.min((apiWeight / 1200) * 100, 100)}%` }}
              />
            </div>
            <span className="text-[0.7rem] font-semibold text-[#6a4b63]">System Healthy</span>
          </div>
        )}

        <section className="pt-2">
          <h2 className="section-title mb-3 md:mb-4">Spot Risk Analysis</h2>
          <RiskMetrics metrics={riskMetrics} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8">
          <div className="cute-card bg-[#fffaf6]/80 p-3 md:p-5 lg:col-span-2">
            <h2 className="section-title mb-3 md:mb-4">Holdings</h2>
            <HoldingsTable holdings={holdings} />
          </div>
          <div className="cute-card bg-[#fffaf6]/80 p-3 md:p-5">
            <h2 className="section-title mb-3 md:mb-4">Allocation</h2>
            <AllocationChart holdings={holdings} />
          </div>
        </div>

        <section className="cute-card bg-[#fffaf6]/80 p-3 md:p-5 mb-4 md:mb-8">
          <h2 className="section-title mb-3 md:mb-4">Open Spot Orders</h2>
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6b55d6] border-t-transparent" />
            </div>
          ) : (
            <OpenOrders orders={ordersData} />
          )}
        </section>

        {displayError && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
            <div className="rounded-2xl border border-red-200 bg-white/95 p-4 shadow-2xl">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div className="flex-1">
                  <h4 className="mb-1 text-sm font-bold text-red-500">API Error</h4>
                  <p className="text-xs text-[#5b5766]">{displayError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
