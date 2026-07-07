'use client';

import { useState } from 'react';
import SetupForm from '@/components/SetupForm';
import GameForm from '@/components/GameForm';
import RecommendationCard from '@/components/RecommendationCard';
import HistoryList from '@/components/HistoryList';
import SessionStats from '@/components/SessionStats';
import ThemeToggle from '@/components/ThemeToggle';
import { usePokerGame } from '@/hooks/usePokerGame';

export default function Home() {
  const {
    setup,
    updateSetup,
    history,
    clearHistory,
    recommendation,
    calculating,
    calculate,
    newHand,
    recordHandResult,
    lastHandId,
    resetSession,
  } = usePokerGame();

  const [setupDone, setSetupDone] = useState(false);

  if (!setupDone) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #1b4d3d)',
                boxShadow: '0 4px 20px var(--accent-glow)',
              }}>
              <span className="text-3xl font-black text-white">♠</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text)' }}>Poker+</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Калькулятор покерных решений</p>
          </div>
          <SetupForm
            setup={setup}
            onUpdate={updateSetup}
            onDone={() => setSetupDone(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 pb-24">
      <div className="max-w-md mx-auto space-y-3">

        <div className="rounded-2xl px-4 py-3 shadow-lg"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--card-border)',
          }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), #1b4d3d)',
                }}>
                <span className="text-sm font-black text-white">♠</span>
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight" style={{ color: 'var(--text)' }}>Poker+</h1>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Стек ${setup.currentStack} · {setup.playersCount}-max
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <button
                onClick={() => { setSetupDone(false); }}
                className="text-[11px] rounded-lg transition-colors px-2.5 py-1.5"
                style={{
                  color: 'var(--text-muted)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                Настройки
              </button>
              <button
                onClick={newHand}
                className="text-[11px] font-bold rounded-lg px-2.5 py-1.5 text-white transition-colors shadow-sm"
                style={{
                  backgroundColor: 'var(--accent)',
                }}
              >
                + Раздача
              </button>
              <button
                onClick={() => { resetSession(); setSetupDone(false); }}
                className="text-[11px] rounded-lg px-2.5 py-1.5 transition-colors"
                style={{
                  color: '#f87171',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                Сброс
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4 shadow-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--card-border)',
          }}>
          <GameForm
            playersCount={setup.playersCount}
            onCalculate={calculate}
            calculating={calculating}
          />
        </div>

        {recommendation && (
          <RecommendationCard
            rec={recommendation}
            handId={lastHandId || undefined}
            onRecordResult={recordHandResult}
          />
        )}

        <SessionStats
          history={history}
          currentStack={setup.currentStack}
          startingStack={setup.buyIn}
        />
        <HistoryList history={history} onClear={clearHistory} />
      </div>
    </div>
  );
}
