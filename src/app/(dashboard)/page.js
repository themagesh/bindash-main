
'use client';

import { useState, useEffect } from 'react';
import { useFetch, formatCurrency } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import FuturesPositions from '@/components/FuturesPositions';
import FuturesRiskMetrics from '@/components/FuturesRiskMetrics';
import PositionCharts from '@/components/PositionCharts';
import GoalModal from '@/components/GoalModal';

export default function FuturesPage() {
  const [displayError, setDisplayError] = useState(null);
  const [goalModalOpen, setGoalModalOpen] = useState(true);
  const REFRESH_INTERVAL = 3000;

  const {
    data: futuresData,
    loading: futuresLoading,
    error: futuresError,
    refetch: refetchFutures,
    apiWeight,
  } = useFetch('/api/futures?type=positions', { refreshInterval: REFRESH_INTERVAL });

  const {
    data: pendingOrdersData,
    refetch: refetchPendingOrders,
  } = useFetch('/api/futures?type=orders', { refreshInterval: REFRESH_INTERVAL });

  useEffect(() => {
    if (futuresError) {
      setDisplayError(futuresError);
    } else if (displayError) {
      const timer = setTimeout(() => setDisplayError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [futuresError, displayError]);

  if (futuresLoading && !futuresData) {
    return <LoadingSpinner text="Loading futures data..." />;
  }

  const { account: futuresAccount, positions: futuresPositions, riskMetrics: futuresRiskMetrics } = futuresData || {};
  const currentBalance = (futuresAccount?.totalWalletBalance || 0) + (futuresAccount?.totalUnrealizedProfit || 0);
  const pnl = futuresAccount?.totalUnrealizedProfit || 0;

  return (
    <div className="dashboard-shell">
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
                  <p className="money-value text-[2.25rem] md:text-[3.6rem] leading-none text-[#1f1f1f]">
                    {formatCurrency(currentBalance, 2)}
                  </p>
                  {futuresAccount?.totalUnrealizedProfit !== undefined && (
                    <div className={`score-pill mt-3 ${pnl >= 0 ? 'bg-[#f5f5f5]/70 text-[#0e8f69]' : 'bg-[#ffe3e3]/70 text-[#d64a5d]'}`}>
                      <span>{pnl >= 0 ? '↓' : '↑'}</span>
                      <span>{pnl >= 0 ? '+' : ''}{formatCurrency(futuresAccount.totalUnrealizedProfit, 2)} unrealized</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="cute-card card-soft-cream flex-1 min-h-[180px] p-4 md:p-5">
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#534b2d]">Goal Target</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 text-xl shadow-inner">🎯</div>
                </div>

                <button
                  onClick={() => setGoalModalOpen(true)}
                  className="money-value text-left text-[2rem] md:text-[3rem] text-[#1d2433] hover:text-[#3b4ee9] transition-colors"
                >
                  $100,000
                </button>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-3 gap-3">
              <div className="cute-card card-soft-blue p-3 md:p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#4f597e]">Wallet</p>
                <p className="money-value mt-3 text-[1.2rem] md:text-[1.8rem] text-[#1f2d4a]">
                  {formatCurrency(futuresAccount?.totalWalletBalance || 0, 2)}
                </p>
              </div>
              <div className="cute-card card-soft-violet p-3 md:p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#4d3f79]">Margin</p>
                <p className="money-value mt-3 text-[1.2rem] md:text-[1.8rem] text-[#2e1a4b]">
                  {formatCurrency(futuresAccount?.availableBalance || 0, 2)}
                </p>
              </div>
              <div className="cute-card card-soft-pink p-3 md:p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#70475d]">PnL</p>
                <p className={`money-value mt-3 text-[1.2rem] md:text-[1.8rem] ${(pnl >= 0 ? 'text-[#0d7657]' : 'text-[#d64053]')}`}>
                  {(pnl >= 0 ? '+' : '')}{formatCurrency(pnl, 2)}
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
            <h2 className="section-title mb-3 md:mb-4">Futures Risk Analysis</h2>
            {futuresLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d96fb6] border-t-transparent" />
              </div>
            ) : (
              <FuturesRiskMetrics metrics={futuresRiskMetrics} account={futuresAccount} positions={futuresPositions} />
            )}
          </section>

          <section className="cute-card bg-[#fffaf6]/80 p-3 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="section-title">Open Positions</h2>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f2e0ff] text-xl text-[#6b55d6]">›</span>
            </div>

            {futuresLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6b55d6] border-t-transparent" />
              </div>
            ) : (
              <FuturesPositions
                positions={futuresPositions}
                onRefresh={refetchFutures}
                pendingOrders={pendingOrdersData || []}
              />
            )}
          </section>

          {futuresPositions && futuresPositions.length > 0 && <PositionCharts positions={futuresPositions} />}

          {displayError && (
            <div className="fixed bottom-4 left-4 z-50 max-w-xs w-[calc(100vw-2rem)] md:w-80">
              <div className="rounded-2xl border border-red-200 bg-white/95 p-4 shadow-2xl">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 text-lg mt-0.5">⚠️</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 text-sm font-bold text-red-500">API Rate Limit</h4>
                    <p className="text-xs leading-relaxed text-[#5b5766]">{displayError}</p>
                  </div>
                  <button onClick={() => setDisplayError(null)} className="text-lg leading-none text-[#7c7a86]">×</button>
                </div>
                <div className="mt-3">
                  <button onClick={refetchFutures} className="w-full rounded-xl bg-red-500 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-600">
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          <GoalModal isOpen={goalModalOpen} onClose={() => setGoalModalOpen(false)} futuresAccount={futuresAccount} />
        </div>
      </div>
    </div>
  );
}
