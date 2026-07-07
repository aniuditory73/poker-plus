'use client';

import { GameSetup } from '@/lib/poker';

interface Props {
  setup: GameSetup;
  onUpdate: (data: Partial<GameSetup>) => void;
  onDone: () => void;
}

export default function SetupForm({ setup, onUpdate, onDone }: Props) {
  return (
    <div className="rounded-2xl p-5 shadow-xl space-y-4"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Настройки партии</h2>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['Бай-ин ($)', setup.buyIn, (v: number) => onUpdate({ buyIn: v })],
          ['Игроков', setup.playersCount, (v: number) => onUpdate({ playersCount: Math.min(10, Math.max(2, v)) })],
          ['Малый блайнд ($)', setup.smallBlind, (v: number) => onUpdate({ smallBlind: Math.max(1, v) })],
          ['Большой блайнд ($)', setup.bigBlind, (v: number) => onUpdate({ bigBlind: Math.max(2, v) })],
          ['Анте ($)', setup.ante, (v: number) => onUpdate({ ante: Math.max(0, v) })],
          ['Текущий стек ($)', setup.currentStack, (v: number) => onUpdate({ currentStack: Math.max(1, v) })],
        ].map(([label, val, onChange]) => (
          <div key={label as string}>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label as string}</label>
            <input
              type="number"
              value={val as number}
              onChange={e => (onChange as (v: number) => void)(Number(e.target.value))}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text)', border: '1px solid var(--border)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onDone}
        className="w-full text-white font-bold py-3 rounded-xl text-lg transition-all shadow-lg"
        style={{ background: 'linear-gradient(135deg, var(--accent), #1b6d9b)', boxShadow: '0 4px 15px var(--accent-glow)' }}
      >
        Начать игру
      </button>
    </div>
  );
}
