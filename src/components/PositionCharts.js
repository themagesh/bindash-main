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

  const symbols = [...new Set(positions.map(p => p.symbol))];
  const currentLabel = timeIntervals.find(t => t.value === selectedInterval)?.label || '15m';

  return (
    <section className="mb-4 md:mb-8 p-3 md:p-4 bg-[#181a20] rounded-2xl border border-gray-800 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#fcd535] font-semibold">Market View</p>
          <h2 className="text-lg md:text-xl font-semibold text-white mt-1">Position Charts</h2>
        </div>

        <div className="flex items-center gap-1 bg-[#23262f] rounded-xl p-1 border border-gray-700 shadow-inner">
          {timeIntervals.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedInterval(tf.value)}
              className={`px-2.5 py-1.5 text-[11px] md:text-xs font-semibold rounded-lg transition-all ${
                selectedInterval === tf.value
                  ? 'bg-[#fcd535] text-[#181a20] shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {symbols.map((symbol) => (
          <div
            key={`${symbol}-${selectedInterval}`}
            className="overflow-hidden rounded-2xl border border-gray-700 bg-[#23262f] shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-700 bg-[#20242d]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00d4ff] shadow-[0_0_16px_rgba(0,221,255,0.8)]" />
                <span className="text-sm font-semibold text-white">{symbol.replace('USDT', '')}</span>
              </div>
              <span className="text-[11px] font-medium text-[#fcd535] uppercase tracking-wide">{currentLabel}</span>
            </div>
            <div className="h-[330px] md:h-[360px]">
              <AdvancedChart symbol={`${symbol}.p`} interval={selectedInterval} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
