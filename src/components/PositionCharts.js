'use client';

import { useState, useEffect, useRef } from 'react';

const timeIntervals = [
  { label: '1m', value: '1' },
  { label: '3m', value: '3' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1H', value: '60' },
  { label: '4H', value: '240' },
  { label: '1D', value: 'D' },
];

function AdvancedChart({ symbol, interval = '240' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: `BINANCE:${symbol}`,
      width: '100%',
      height: '100%',
      interval: interval,
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      hide_top_toolbar: true,
      hide_legend: true,
      hide_symbol_logo: true,
      withdateranges: true,
      save_image: false,
      calendar: false,
      hide_volume: true,
      overrides: {
        'paneProperties.vertGridProperties.color': 'rgba(0,0,0,0)',
        'paneProperties.horzGridProperties.color': 'rgba(0,0,0,0)',
        'paneProperties.vertGridProperties.style': 0,
        'paneProperties.horzGridProperties.style': 0,
      },
      studies: [
        'MACD@tv-basicstudies',
        'Stochastic@tv-basicstudies',
        'BB@tv-basicstudies', // Add Bollinger Bands
      ],
      support_host: 'https://www.tradingview.com',
    });

    containerRef.current.appendChild(script);
  }, [symbol, interval]);

  return (
    <div ref={containerRef} className="h-full w-full rounded-xl overflow-hidden bg-[#181a20]" />
  );
}

export default function PositionCharts({ positions = [] }) {
  const [selectedInterval, setSelectedInterval] = useState('60');

  if (!positions || positions.length === 0) {
    return null;
  }

  const symbols = [...new Set(positions.map(p => p?.symbol).filter(Boolean))];
  const currentLabel = timeIntervals.find(t => t.value === selectedInterval)?.label || '15m';

  return (
    <section className="mb-4 md:mb-8 rounded-[22px] border border-gray-800 bg-[#111418] p-3 md:p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.04),0_20px_40px_rgba(0,0,0,0.28)]">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fcd535]">Market View</p>
          <h2 className="mt-1 text-lg font-semibold text-white md:text-xl">Position Charts</h2>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-gray-700 bg-[#1d2229] p-1 shadow-inner shadow-black/40">
          {timeIntervals.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedInterval(tf.value)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all md:text-xs ${
                selectedInterval === tf.value
                  ? 'bg-[#fcd535] text-[#111418] shadow-[0_0_12px_rgba(252,213,53,0.45)]'
                  : 'text-gray-400 hover:bg-gray-700/70 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {symbols.map((symbol) => (
          <div
            key={`${symbol}-${selectedInterval}`}
            className="overflow-hidden rounded-[18px] border border-gray-700 bg-[#1a1f26] shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
          >
            <div className="flex items-center justify-between border-b border-gray-700 bg-[#171c22] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#00d4ff] shadow-[0_0_14px_rgba(0,212,255,0.9)]" />
                <span className="text-sm font-semibold text-white">{String(symbol || '').replace('USDT', '')}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#fcd535]/30 bg-[#fcd535]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#fcd535]">
                  {currentLabel}
                </span>
              </div>
            </div>

            <div className="relative bg-[#101317]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(252,213,53,0.12),transparent_25%)]" />
              <div className="relative h-[330px] md:h-[360px]">
                <AdvancedChart symbol={`${symbol}.p`} interval={selectedInterval} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
