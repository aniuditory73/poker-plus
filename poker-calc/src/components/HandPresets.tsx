'use client';

import { Rank } from '@/lib/poker';

export interface PresetInfo {
  label: string;
  rank1: Rank;
  rank2: Rank;
  suited: boolean;
}

interface Props {
  onSelect: (preset: PresetInfo) => void;
}

const CATEGORIES: { title: string; hands: PresetInfo[] }[] = [
  {
    title: 'Premium',
    hands: [
      { label: 'AA', rank1: Rank.Ace, rank2: Rank.Ace, suited: false },
      { label: 'KK', rank1: Rank.King, rank2: Rank.King, suited: false },
      { label: 'QQ', rank1: Rank.Queen, rank2: Rank.Queen, suited: false },
      { label: 'AKs', rank1: Rank.Ace, rank2: Rank.King, suited: true },
      { label: 'AKo', rank1: Rank.Ace, rank2: Rank.King, suited: false },
    ],
  },
  {
    title: 'Пары',
    hands: [
      { label: 'JJ', rank1: Rank.Jack, rank2: Rank.Jack, suited: false },
      { label: 'TT', rank1: Rank.Ten, rank2: Rank.Ten, suited: false },
      { label: '99', rank1: Rank.Nine, rank2: Rank.Nine, suited: false },
      { label: '88', rank1: Rank.Eight, rank2: Rank.Eight, suited: false },
      { label: '77', rank1: Rank.Seven, rank2: Rank.Seven, suited: false },
    ],
  },
];

export default function HandPresets({ onSelect }: Props) {
  return (
    <div className="space-y-3">
      {CATEGORIES.map(cat => (
        <div key={cat.title}>
          <div className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            {cat.title}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cat.hands.map(hand => (
              <button
                key={hand.label}
                onClick={() => onSelect(hand)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text)',
                }}
              >
                {hand.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
