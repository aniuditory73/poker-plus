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
      <label className="block text-xs text-gray-400 mb-2">Позиция</label>
      <div className="flex flex-wrap gap-2">
        {positions.map(pos => (
          <button
            key={pos}
            onClick={() => onSelect(pos)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              selected === pos
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}
