'use client';

import { useState } from 'react';
import SetupForm from '@/components/SetupForm';
import GameForm from '@/components/GameForm';
import RecommendationCard from '@/components/RecommendationCard';
import HistoryList from '@/components/HistoryList';
import SessionStats from '@/components/SessionStats';
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
        style={{ background: 'radial-gradient(ellipse at center, #1a3a2a 0%, #0f1923 70%)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2d9cdb] to-[#1b4d3d] mb-4 shadow-lg shadow-[#2d9cdb]/20">
              <span className="text-3xl font-black text-white">♠</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Poker+</h1>
            <p className="text-gray-400 text-sm mt-1">Калькулятор покерных решений</p>
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

        <div className="backdrop-blur-xl bg-[#1a2c38]/80 rounded-2xl px-4 py-3 border border-[#2a4a5a]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2d9cdb] to-[#1b4d3d] flex items-center justify-center shadow-sm">
                <span className="text-sm font-black text-white">♠</span>
              </div>
              <div>
                <h1 className="text-base font-black text-white tracking-tight">Poker+</h1>
                <p className="text-[10px] text-gray-500">
                  Стек ${setup.currentStack} · {setup.playersCount}-max
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => { setSetupDone(false); }}
                className="text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Настройки
              </button>
              <button
                onClick={newHand}
                className="text-[11px] text-white bg-[#2d9cdb] hover:bg-[#268cc7] px-2.5 py-1.5 rounded-lg font-bold transition-colors shadow-sm"
              >
                + Раздача
              </button>
              <button
                onClick={() => { resetSession(); setSetupDone(false); }}
                className="text-[11px] text-red-400 hover:text-red-300 bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                Сброс
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#1a2c38]/60 rounded-2xl p-4 border border-[#2a4a5a]/20 shadow-sm">
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
