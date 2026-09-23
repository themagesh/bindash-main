'use client';

import { useState, useEffect } from 'react';
import { useFetch } from '@/lib/utils';
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
    refetch: refetchPortfolio,
    apiWeight
  } = useFetch('/api/portfolio', { refreshInterval: REFRESH_INTERVAL });

  const { 
    data: ordersData, 
    loading: ordersLoading 
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

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Spot Portfolio</h1>
        <p className="text-gray-500 text-sm">
          {lastUpdated && `Updated ${new Date(lastUpdated).toLocaleTimeString()}`}
        </p>
      </div>

      {/* API Weight Display */}
      {apiWeight !== null && (
        <div className={`mb-4 px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 ${
          apiWeight > 1000 ? 'bg-red-500/20 border border-red-500/30 text-red-400' :
          apiWeight > 600 ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
          'bg-green-500/20 border border-green-500/30 text-green-400'
        }`}>
          <span>⚡ API Weight:</span>
          <span className="font-bold">{apiWeight}/1200</span>
          <div className="flex-1 bg-gray-700 rounded-full h-1.5 ml-2">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                apiWeight > 1000 ? 'bg-red-500' : apiWeight > 600 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((apiWeight / 1200) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Spot Risk Metrics */}
      <section className="mb-4 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Spot Risk Analysis</h2>
        <RiskMetrics metrics={riskMetrics} />
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Holdings</h2>
          <HoldingsTable holdings={holdings} />
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Allocation</h2>
          <AllocationChart holdings={holdings} />
        </div>
      </div>

      {/* Open Orders */}
      <section className="bg-gray-800/50 rounded-xl border border-gray-700 p-3 md:p-6 mb-4 md:mb-8">
        <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Open Spot Orders</h2>
        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <OpenOrders orders={ordersData} />
        )}
      </section>

      {/* Error Card */}
      {displayError && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
          <div className="bg-gray-800 border border-red-500/50 rounded-xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div className="flex-1">
                <h4 className="text-red-400 font-medium text-sm mb-1">API Error</h4>
                <p className="text-gray-300 text-xs">{displayError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-gray-500 text-xs md:text-sm py-4">
        <p>Binance Portfolio Risk Dashboard</p>
      </footer>
    </div>
  );
}
