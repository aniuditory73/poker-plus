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
      <label className="block text-xs text-gray-400 mb-2 font-medium">Позиция</label>
      <div className="flex flex-wrap gap-1.5">
        {positions.map(pos => (
          <button
            key={pos}
            onClick={() => onSelect(pos)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selected === pos
                ? 'bg-[#2d9cdb] text-white shadow-sm'
                : 'bg-[#0f1923]/60 text-gray-400 hover:text-white hover:bg-[#2a4a5a]/30'
            }`}
          >
            {pos}
          </button>
        ))}
      </div>
    </div>
  );
}
