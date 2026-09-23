'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatCurrency } from '@/lib/utils';

export default function GoalModal({ isOpen, onClose, futuresAccount }) {
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [completedTrades, setCompletedTrades] = useState([]);
  const [savedStartingBalance, setSavedStartingBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const targetAmount = 100000;
  const profitPercent = 2;

  const currentBalance = futuresAccount?.totalWalletBalance || 0;

  // Load data from database
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [goalRes, futuresRes] = await Promise.all([
          fetch('/api/compound'),
          fetch('/api/futures?type=positions')
        ]);
        const goalData = await goalRes.json();
        const futuresData = await futuresRes.json();

        const bal = (futuresData.account?.totalWalletBalance || 0) + (futuresData.account?.totalUnrealizedProfit || 0);
        const startBal = goalData?.startingBalance || futuresData.account?.totalWalletBalance || bal || 1000;
        const trades = goalData?.completedTrades || [];

        setSavedStartingBalance(startBal);
        setCompletedTrades(trades);
      } catch (error) {
        console.error('Failed to load goal data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isOpen]);

  // Calculate current milestone
  useEffect(() => {
    if (savedStartingBalance == null || loading) return;

    let balance = savedStartingBalance > 0 ? savedStartingBalance : 1000;
    let tradeNumber = 1;
    const completedCount = completedTrades.length;

    while (balance < targetAmount && tradeNumber <= 500) {
      const profit = balance * (profitPercent / 100);
      const endBalance = balance + profit;

      if (tradeNumber === completedCount + 1) {
        setCurrentMilestone({
          trade: tradeNumber,
          startBalance: balance,
          profit: profit,
          endBalance: endBalance
        });
        return;
      }

      balance = endBalance;
      tradeNumber++;
    }

    // All trades completed or no milestone
    setCurrentMilestone(null);
  }, [savedStartingBalance, completedTrades, loading, targetAmount, profitPercent]);

  const markTradeComplete = async () => {
    if (!currentMilestone) return;
    setSaving(true);
    try {
      const newTrades = [
        ...completedTrades,
        {
          trade: currentMilestone.trade,
          startBalance: currentMilestone.startBalance,
          endBalance: currentMilestone.endBalance,
          profit: currentMilestone.profit,
          completedAt: new Date().toISOString(),
        },
      ];
      setCompletedTrades(newTrades);

      await fetch('/api/compound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingBalance: savedStartingBalance,
          completedTrades: newTrades,
        }),
      });
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle keyboard escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-900/95">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h2 className="text-lg font-bold text-white">Current Trade Achievement</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : currentMilestone ? (
              <div className="space-y-4">
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                      style={{ width: `${(completedTrades.length / (completedTrades.length + 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">#{currentMilestone.trade}</span>
                </div>

                {/* Current Trade Card */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/40">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {currentMilestone.trade}
                    </span>
                    Trade #{currentMilestone.trade}
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Start</p>
                      <p className="text-white font-bold text-sm">
                        {formatCurrency(currentMilestone.startBalance)}
                      </p>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">Target Profit</p>
                      <p className="text-green-400 font-bold text-sm">
                        +{formatCurrency(currentMilestone.profit)}
                      </p>
                    </div>
                    <div className="bg-gray-800/60 rounded-lg p-3">
                      <p className="text-gray-400 text-xs mb-1">End Balance</p>
                      <p className="text-blue-400 font-bold text-sm">
                        {formatCurrency(currentMilestone.endBalance)}
                      </p>
                    </div>
                  </div>

                  {/* Achievement Goal */}
                  <div className="flex items-center justify-between bg-gray-800/40 rounded-lg px-3 py-2 mb-4">
                    <span className="text-gray-400 text-xs">Need to earn</span>
                    <span className="text-green-400 font-bold text-base">+{formatCurrency(currentMilestone.profit)}</span>
                  </div>

                  <button
                    onClick={markTradeComplete}
                    disabled={saving}
                    className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark Trade #{currentMilestone.trade} Complete
                      </>
                    )}
                  </button>
                </div>

                {/* Summary */}
                <div className="flex justify-between text-xs text-gray-500 px-1">
                  <span>{completedTrades.length} trades completed</span>
                  <span>Target: {formatCurrency(targetAmount)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-green-400 mb-1">Goal Achieved!</h3>
                <p className="text-gray-400 text-sm">
                  You've reached {formatCurrency(targetAmount)}!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}