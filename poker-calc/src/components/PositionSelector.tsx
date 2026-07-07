'use client';

import { getPositions } from '@/lib/poker';

interface Props {
  playerCount: number;
  selected: string;
  onSelect: (pos: string) => void;
}

export default function PositionSelector({ playerCount, selected, onSelect }: Props) {
  const positions = getPositions(playerCount);

  return (
    <div>
      <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Позиция</label>
      <div className="flex flex-wrap gap-1.5">
        {positions.map(pos => (
          <button
            key={pos}
            onClick={() => onSelect(pos)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: selected === pos ? 'var(--accent)' : 'var(--surface)',
              color: selected === pos ? 'white' : 'var(--text-secondary)',
            }}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}
