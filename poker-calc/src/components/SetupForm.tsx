'use client';

import { GameSetup } from '@/lib/poker';

interface Props {
  setup: GameSetup;
  onUpdate: (data: Partial<GameSetup>) => void;
  onDone: () => void;
}

export default function SetupForm({ setup, onUpdate, onDone }: Props) {
  return (
    <div className="backdrop-blur-xl bg-[#1a2c38]/80 rounded-2xl p-5 border border-[#2a4a5a]/30 shadow-xl space-y-4">
      <h2 className="text-lg font-bold text-white">Настройки партии</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Бай-ин ($)</label>
          <input
            type="number"
            value={setup.buyIn}
            onChange={e => onUpdate({ buyIn: Math.max(1, Number(e.target.value)) })}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Игроков</label>
          <input
            type="number"
            min={2}
            max={10}
            value={setup.playersCount}
            onChange={e => onUpdate({ playersCount: Math.min(10, Math.max(2, Number(e.target.value))) })}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Малый блайнд ($)</label>
          <input
            type="number"
            value={setup.smallBlind}
            onChange={e => onUpdate({ smallBlind: Math.max(1, Number(e.target.value)) })}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Большой блайнд ($)</label>
          <input
            type="number"
            value={setup.bigBlind}
            onChange={e => onUpdate({ bigBlind: Math.max(2, Number(e.target.value)) })}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Анте ($)</label>
          <input
            type="number"
            value={setup.ante}
            onChange={e => onUpdate({ ante: Math.max(0, Number(e.target.value)) })}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Текущий стек ($)</label>
          <input
            type="number"
            value={setup.currentStack}
            onChange={e => onUpdate({ currentStack: Math.max(1, Number(e.target.value)) })}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full bg-gradient-to-r from-[#2d9cdb] to-[#1b6d9b] hover:from-[#268cc7] hover:to-[#155d8a] text-white font-bold py-3 rounded-xl text-lg transition-all shadow-lg shadow-[#2d9cdb]/20"
      >
        Начать игру
      </button>
    </div>
  );
}
