'use client';

import { useEffect, useRef } from 'react';

const timeframes = [
  { label: '15m', interval: '15m' },
  { label: '1H', interval: '1h' },
  { label: '4H', interval: '4h' },
  { label: '1D', interval: '1D' },
];

function TradingViewWidget({ symbol = 'BTCUSDT', interval = '1h' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: interval,
      width: '100%',
      isTransparent: true,
      height: 400,
      symbol: `BINANCE:${symbol}`,
      showIntervalTabs: false,
      displayMode: 'single',
      locale: 'en',
      colorTheme: 'dark',
    });

    containerRef.current.appendChild(script);
  }, [symbol, interval]);

  return (
    <div ref={containerRef} className="h-[400px] overflow-hidden" />
  );
}

export default function MarketSentiment({ symbol = 'BTCUSDT' }) {
  return (
    <section className="mb-4 md:mb-8">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">
        Market Sentiment - {symbol}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {timeframes.map((tf) => (
          <div 
            key={tf.interval}
            className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden"
          >
            <div className="bg-gray-700/50 px-3 py-2 border-b border-gray-700">
              <span className="text-sm font-medium text-white">{tf.label}</span>
            </div>
            <TradingViewWidget symbol={symbol} interval={tf.interval} />
          </div>
        ))}
      </div>
    </section>
  );
}
