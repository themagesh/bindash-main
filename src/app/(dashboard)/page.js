
'use client';

import {
  Activity,
  ArrowDown,
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Crown,
  Gauge,
  Goal,
  Heart,
  History,
  LineChart,
  LockKeyhole,
  Menu,
  Moon,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFetch, formatCurrency } from '@/lib/utils';
import { useTheme } from '@/components/ThemeContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import FuturesPositions from '@/components/FuturesPositions';
import PositionCharts from '@/components/PositionCharts';
import GoalModal from '@/components/GoalModal';

function MetricCard({ title, value, sub, icon, tone }) {
  return (
    <div className={`metric-card ${tone}`}>
      <div className="card-decoration">✧</div>
      <div className="metric-title">
        <span className="metric-icon">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="metric-value">{value}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

function RsiCard({ timeframe, value, tone }) {
  const angle = -75 + (value / 100) * 150;

  return (
    <div className={`rsi-card ${tone}`}>
      <div className="rsi-title">
        <Activity size={16} />
        BTC RSI {timeframe}
      </div>
      <div className="gauge">
        <div className="gauge-arc" />
        <div className="gauge-needle" style={{ transform: `rotate(${angle}deg)` }}>
          <span />
        </div>
        <div className="gauge-center" />
      </div>
      <div className="rsi-value">{value}</div>
      <div className="rsi-label">Neutral</div>
    </div>
  );
}

export default function FuturesPage() {
  const [displayError, setDisplayError] = useState(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
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
  const walletBalance = futuresAccount?.totalWalletBalance || 0;
  const pnl = futuresAccount?.totalUnrealizedProfit || 0;
  const currentBalance = walletBalance + pnl;
  const availableBalance = futuresAccount?.availableBalance || 0;

  const stats = [
    {
      title: 'Unrealized PnL',
      value: `${pnl >= 0 ? '+' : '-'}$${Math.abs(Number(pnl) || 0).toFixed(2)}`,
      sub: `${(Number(futuresRiskMetrics?.totalPnLPercent) || 0).toFixed(1)}%`,
      icon: <TrendingDown size={16} />,
      tone: 'pink',
    },
    {
      title: 'Wallet Balance',
      value: `$${(Number(walletBalance) || 0).toFixed(2)}`,
      sub: `Available: $${(Number(availableBalance) || 0).toFixed(2)}`,
      icon: <Wallet size={16} />,
      tone: 'blue',
    },
    {
      title: 'If All SL Hit',
      value: `$${((Number(walletBalance) || 0) + (Number(futuresRiskMetrics?.totalPnL) || 0)).toFixed(2)}`,
      sub: 'Loss: $0',
      icon: <ShieldCheck size={16} />,
      tone: 'yellow',
    },
    {
      title: 'Maint. Margin',
      value: `$${(Number(futuresAccount?.totalMaintMargin) || 0).toFixed(2)}`,
      sub: '1.7% of balance',
      icon: <Gauge size={16} />,
      tone: 'green',
    },
    {
      title: 'Open Positions',
      value: String(futuresPositions?.length || 0),
      sub: `USDT: $${(Number(futuresRiskMetrics?.totalNotional) || 0).toFixed(0)}`,
      icon: <BriefcaseBusiness size={16} />,
      tone: 'purple',
    },
    {
      title: 'Long',
      value: `$${(Number(futuresRiskMetrics?.longExposure) || 0).toFixed(0)}`,
      sub: 'USDT Long',
      icon: <TrendingUp size={16} />,
      tone: 'cyan',
    },
    {
      title: 'Short',
      value: `$${(Number(futuresRiskMetrics?.shortExposure) || 0).toFixed(0)}`,
      sub: 'USDT Short',
      icon: <TrendingDown size={16} />,
      tone: 'orange',
    },
  ];

  return (
    <main className="app">
      <div className="paper-noise" />

      <section className="hero-grid">
        <div className="balance-card">
          <span className="sparkle sparkle-one">✦</span>
          <span className="sparkle sparkle-two">✦</span>
          <div>
            <div className="eyebrow">CURRENT BALANCE</div>
            <div className="balance">{formatCurrency(currentBalance, 2)}</div>
            <div className="loss-chip">
              <ArrowDown size={15} />
              {pnl >= 0 ? '+' : '-'}{formatCurrency(Math.abs(pnl), 2)} unrealized
            </div>
          </div>

          <div className="goal-box" onClick={() => setGoalModalOpen(true)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setGoalModalOpen(true)}>
            <Goal size={38} />
            <div>
              <div className="eyebrow">GOAL TARGET</div>
              <div className="goal-value">$100,000</div>
            </div>
          </div>
          <Crown className="mini-crown" size={42} />
        </div>

        <div className="summary-card blue">
          <Wallet size={31} />
          <div>
            <span>Wallet</span>
            <strong>{formatCurrency(walletBalance, 2)}</strong>
          </div>
        </div>

        <div className="summary-card purple">
          <TrendingUp size={31} />
          <div>
            <span>Margin</span>
            <strong>{formatCurrency(availableBalance, 2)}</strong>
          </div>
        </div>

        <div className="summary-card pink">
          <LineChart size={31} />
          <div>
            <span>PnL</span>
            <strong>{pnl >= 0 ? '+' : '-'}{formatCurrency(Math.abs(pnl), 2)}</strong>
          </div>
        </div>
      </section>

      {apiWeight !== null && (
        <section className="api-row">
          <div className="api-title">
            <Zap size={19} fill="currentColor" />
            API Weight
            <b>{apiWeight}/1200</b>
          </div>
          <div className="api-track">
            <div className="api-fill" style={{ width: `${Math.min((apiWeight / 1200) * 100, 100)}%` }} />
          </div>
          <div className="health">
            <span />
            System Healthy
            <Heart size={17} />
          </div>
        </section>
      )}

      <section className="section-head">
        <div className="section-title">
          <BarChart3 size={27} />
          <h1>Futures Risk Analysis</h1>
        </div>
        <div className="trade-smart">
          <Sparkles size={19} />
          <span>Trade Smart</span>
          <Heart size={16} fill="currentColor" />
        </div>
      </section>

      <section className="metrics-grid">
        {stats.map((item) => (
          <MetricCard key={item.title} {...item} />
        ))}

        <RsiCard timeframe="1H" value={47} tone="lavender" />
        <RsiCard timeframe="4H" value={35} tone="mint" />
      </section>

      <section className="positions">
        <div className="positions-header">
          <div className="position-title">
            <Search size={28} />
            <h2>Open Positions</h2>
          </div>
          <button className="next-button" aria-label="Open positions next">
            <ChevronRight size={28} />
          </button>
        </div>

        <ErrorBoundary label="Open Positions">
          <FuturesPositions
            positions={futuresPositions || []}
            pendingOrders={pendingOrdersData || []}
            onRefresh={refetchFutures}
          />
        </ErrorBoundary>
      </section>

      {futuresPositions?.length > 0 && (
        <ErrorBoundary label="Position Charts">
          <PositionCharts positions={futuresPositions} />
        </ErrorBoundary>
      )}

      <footer className="footer">
        <div>
          <LockKeyhole size={15} />
          Data protected
        </div>
        <button type="button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
          <Moon size={16} />
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
        <button type="button" onClick={() => setSettingsOpen(true)}>
          <Settings2 size={16} />
          Settings
        </button>
      </footer>

      {settingsOpen && (
        <div className="settings-backdrop" role="presentation" onClick={() => setSettingsOpen(false)}>
          <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}>
            <div className="settings-header">
              <div>
                <div className="eyebrow">DASHBOARD SETTINGS</div>
                <h2 id="settings-title">Preferences</h2>
              </div>
              <button type="button" className="settings-close" onClick={() => setSettingsOpen(false)} aria-label="Close settings">
                <X size={20} />
              </button>
            </div>
            <label className="settings-option">
              <span>
                <strong>Dark mode</strong>
                <small>Use a darker dashboard palette</small>
              </span>
              <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} />
            </label>
            <button type="button" className="settings-save" onClick={() => setSettingsOpen(false)}>
              Done
            </button>
          </section>
        </div>
      )}

      {displayError && (
        <div className="fixed bottom-4 left-4 z-50 max-w-xs w-[calc(100vw-2rem)] md:w-80">
          <div className="alert-box">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-lg mt-0.5">⚠️</span>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 text-sm font-bold text-red-500">API Rate Limit</h4>
                <p className="text-xs leading-relaxed text-[#5b5766]">{displayError}</p>
              </div>
              <button onClick={() => setDisplayError(null)} className="text-lg leading-none text-[#7c7a86]">×</button>
            </div>
          </div>
        </div>
      )}

      <GoalModal isOpen={goalModalOpen} onClose={() => setGoalModalOpen(false)} futuresAccount={futuresAccount} />
    </main>
  );
}
