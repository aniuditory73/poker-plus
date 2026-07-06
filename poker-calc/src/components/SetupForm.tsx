'use client';

import { GameSetup } from '@/lib/poker';

interface Props {
  setup: GameSetup;
  onUpdate: (data: Partial<GameSetup>) => void;
  onDone: () => void;
}

export default function SetupForm({ setup, onUpdate, onDone }: Props) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-bold text-white">Настройки партии</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Бай-ин ($)</label>
          <input
            type="number"
            value={setup.buyIn}
            onChange={e => onUpdate({ buyIn: Math.max(1, Number(e.target.value)) })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Игроков</label>
          <input
            type="number"
            min={2}
            max={10}
            value={setup.playersCount}
            onChange={e => onUpdate({ playersCount: Math.min(10, Math.max(2, Number(e.target.value))) })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Малый блайнд ($)</label>
          <input
            type="number"
            value={setup.smallBlind}
            onChange={e => onUpdate({ smallBlind: Math.max(1, Number(e.target.value)) })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Большой блайнд ($)</label>
          <input
            type="number"
            value={setup.bigBlind}
            onChange={e => onUpdate({ bigBlind: Math.max(2, Number(e.target.value)) })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Анте ($)</label>
          <input
            type="number"
            value={setup.ante}
            onChange={e => onUpdate({ ante: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Текущий стек ($)</label>
          <input
            type="number"
            value={setup.currentStack}
            onChange={e => onUpdate({ currentStack: Math.max(1, Number(e.target.value)) })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-lg transition-colors"
      >
        Начать игру
      </button>
    </div>
  );
}
