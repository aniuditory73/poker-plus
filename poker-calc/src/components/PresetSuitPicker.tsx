'use client';

import { useState } from 'react';
import { Card, Suit, Rank, rankToString, suitToSymbol } from '@/lib/poker';
import { PresetInfo } from './HandPresets';

interface Props {
  preset: PresetInfo;
  onConfirm: (card1: Card, card2: Card) => void;
  onCancel: () => void;
}

const ALL_SUITS = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];

function cardColor(suit: Suit): string {
  return suit === Suit.Hearts || suit === Suit.Diamonds ? '#dc2626' : '#111827';
}

export default function PresetSuitPicker({ preset, onConfirm, onCancel }: Props) {
  const [suit1, setSuit1] = useState<Suit | null>(null);
  const [suit2, setSuit2] = useState<Suit | null>(null);

  if (preset.suited) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
          Масть для {preset.label}
        </div>
        <div className="flex gap-2 justify-center">
          {ALL_SUITS.map(suit => (
            <button
              key={suit}
              onClick={() => onConfirm(
                { suit, rank: preset.rank1 },
                { suit, rank: preset.rank2 },
              )}
              className="w-14 h-18 rounded-xl flex flex-col items-center justify-center bg-white shadow-md shadow-black/20 border border-gray-200/80 transition-all hover:scale-105"
            >
              <span className="text-sm font-bold leading-none" style={{ color: cardColor(suit) }}>
                {rankToString(preset.rank1)}{suitToSymbol(suit)}
              </span>
              <span className="text-sm font-bold leading-none mt-1" style={{ color: cardColor(suit) }}>
                {rankToString(preset.rank2)}{suitToSymbol(suit)}
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button onClick={onCancel} className="text-xs" style={{ color: 'var(--text-muted)' }}>Отмена</button>
        </div>
      </div>
    );
  }

  const secondSuits = suit1 ? ALL_SUITS.filter(s => s !== suit1) : ALL_SUITS;

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
        Масти для {preset.label}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SuitColumn
          rank={preset.rank1}
          label="Карта 1"
          suits={ALL_SUITS}
          selected={suit1}
          onSelect={setSuit1}
        />
        <SuitColumn
          rank={preset.rank2}
          label="Карта 2"
          suits={secondSuits}
          selected={suit2}
          onSelect={s => { setSuit2(s); }}
        />
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={onCancel} className="px-4 py-1.5 rounded-lg text-xs transition-colors"
          style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)' }}>
          Отмена
        </button>
        {suit1 && suit2 && (
          <button
            onClick={() => onConfirm(
              { suit: suit1, rank: preset.rank1 },
              { suit: suit2, rank: preset.rank2 },
            )}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Подтвердить
          </button>
        )}
      </div>
    </div>
  );
}

function SuitColumn({ rank, label, suits, selected, onSelect }: {
  rank: Rank;
  label: string;
  suits: Suit[];
  selected: Suit | null;
  onSelect: (suit: Suit) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
      {suits.map(suit => (
        <button
          key={suit}
          onClick={() => onSelect(suit)}
          className="w-14 h-16 rounded-xl flex flex-col items-center justify-center transition-all border"
          style={{
            backgroundColor: selected === suit ? 'white' : 'var(--surface)',
            borderColor: selected === suit ? 'var(--accent)' : 'transparent',
            boxShadow: selected === suit ? '0 0 0 2px var(--accent)' : 'none',
            transform: selected === suit ? 'scale(1.05)' : 'none',
          }}
        >
          <span className="text-base font-bold leading-none" style={{ color: cardColor(suit) }}>
            {rankToString(rank)}
          </span>
          <span className="text-lg leading-none mt-0.5" style={{ color: cardColor(suit) }}>
            {suitToSymbol(suit)}
          </span>
        </button>
      ))}
    </div>
  );
}
