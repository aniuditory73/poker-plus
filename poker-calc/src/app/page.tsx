'use client';

import { useState } from 'react';
import SetupForm from '@/components/SetupForm';
import GameForm from '@/components/GameForm';
import RecommendationCard from '@/components/RecommendationCard';
import HistoryList from '@/components/HistoryList';
import SessionStats from '@/components/SessionStats';
import SessionChart from '@/components/SessionChart';
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

        <div className="rounded-2xl px-3 py-2.5 shadow-lg"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--card-border)',
          }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), #1b4d3d)',
                }}>
                <span className="text-sm font-black text-white">♠</span>
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight" style={{ color: 'var(--text)' }}>Poker+</h1>
                <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                  ${setup.currentStack} · {setup.playersCount}-max
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button onClick={() => { setSetupDone(false); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} title="Настройки">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              </button>
              <button onClick={newHand}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ backgroundColor: 'var(--accent)' }} title="Новая раздача">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button onClick={() => { resetSession(); setSetupDone(false); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} title="Сброс">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
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

        <SessionChart
          history={history}
          currentStack={setup.currentStack}
          startingStack={setup.buyIn}
        />
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
