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
    <div ref={containerRef} className="h-full w-full" />
  );
}

export default function PositionCharts({ positions = [] }) {
  const [selectedInterval, setSelectedInterval] = useState('60');

  if (!positions || positions.length === 0) {
    return null;
  }

  // Get unique symbols from positions
  const symbols = [...new Set(positions.map(p => p.symbol))];
  const currentLabel = timeIntervals.find(t => t.value === selectedInterval)?.label || '15m';

  return (
    <section className="mb-4 md:mb-8">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Position Charts
        </h2>
        
        {/* Time Interval Switcher */}
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
          {timeIntervals.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedInterval(tf.value)}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                selectedInterval === tf.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {symbols.map((symbol) => (
          <div 
            key={`${symbol}-${selectedInterval}`}
            className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="bg-gray-700/50 px-3 py-2 border-b border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium text-white">{symbol.replace('USDT', '')}</span>
              <span className="text-xs text-gray-400">{currentLabel}</span>
            </div>
            <div className="h-[400px]">
              <AdvancedChart symbol={`${symbol}.p`} interval={selectedInterval} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
