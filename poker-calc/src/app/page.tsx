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
      <div className="min-h-screen bg-[#0a0a0a] p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-white">Poker+</h1>
            <p className="text-gray-500 text-sm mt-1">Калькулятор покерных решений</p>
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
    <div className="min-h-screen bg-[#0a0a0a] p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Poker+</h1>
            <p className="text-xs text-gray-500">
              Стек: ${setup.currentStack} | Стол: {setup.playersCount}-max
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => { setSetupDone(false); }}
              className="text-xs text-gray-400 hover:text-white bg-gray-800 px-2.5 py-1.5 rounded-lg"
            >
              Настройки
            </button>
            <button
              onClick={newHand}
              className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg font-bold"
            >
              + Раздача
            </button>
            <button
              onClick={() => { resetSession(); setSetupDone(false); }}
              className="text-xs text-red-400 hover:text-red-300 bg-gray-800 px-2.5 py-1.5 rounded-lg"
            >
              Новая сессия
            </button>
          </div>
        </div>

        <GameForm
          playersCount={setup.playersCount}
          onCalculate={calculate}
          calculating={calculating}
        />

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
