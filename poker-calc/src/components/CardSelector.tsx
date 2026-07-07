'use client';

import { useState } from 'react';
import { Card, Suit, Rank, rankToString, suitToSymbol } from '@/lib/poker';

interface Props {
  label: string;
  value: Card | null;
  onChange: (card: Card | null) => void;
  exclude?: Card[];
}

const SUITS = [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs];
const RANKS: Rank[] = [
  Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven,
  Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace,
];

function isExcluded(card: Card, exclude?: Card[]): boolean {
  if (!exclude) return false;
  return exclude.some(c => c.suit === card.suit && c.rank === card.rank);
}

function cardColor(suit: Suit): string {
  return suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-500' : 'text-gray-900';
}

export default function CardSelector({ label, value, onChange, exclude }: Props) {
  const [selecting, setSelecting] = useState(false);
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);

  const handleSuitSelect = (suit: Suit) => setSelectedSuit(suit);

  const handleRankSelect = (rank: Rank) => {
    if (!selectedSuit) return;
    const card: Card = { suit: selectedSuit, rank };
    if (!isExcluded(card, exclude)) {
      onChange(card);
      setSelecting(false);
      setSelectedSuit(null);
    }
  };

  const handleClear = () => {
    onChange(null);
    setSelecting(false);
    setSelectedSuit(null);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>

      <button
        onClick={() => setSelecting(!selecting)}
        className={`w-14 h-20 rounded-xl flex flex-col items-center justify-center transition-all select-none ${
          value
            ? 'bg-white shadow-md shadow-black/20 border border-gray-200/80'
            : 'border border-dashed'
        }`}
        style={value ? {} : { backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {value ? (
          <div className="relative w-full h-full">
            <span className={`absolute top-0.5 left-1 text-[11px] font-bold leading-none ${cardColor(value.suit)}`}>
              {rankToString(value.rank)}
            </span>
            <span className={`absolute inset-0 flex items-center justify-center text-lg leading-none ${cardColor(value.suit)}`}>
              {suitToSymbol(value.suit)}
            </span>
            <span className={`absolute bottom-0.5 right-1 text-[11px] font-bold leading-none rotate-180 ${cardColor(value.suit)}`}>
              {rankToString(value.rank)}
            </span>
          </div>
        ) : (
          <span className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>?</span>
        )}
      </button>

      {selecting && (
        <div className="rounded-2xl p-4 space-y-3 shadow-2xl border w-full max-w-xs"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex gap-2 justify-center">
            {SUITS.map(suit => (
              <button
                key={suit}
                onClick={() => handleSuitSelect(suit)}
                className={`w-11 h-11 rounded-xl text-xl font-bold transition-all flex items-center justify-center bg-white ${cardColor(suit)}`}
                style={selectedSuit === suit ? { boxShadow: '0 0 0 2px var(--accent)', transform: 'scale(1.1)' } : {}}
              >
                {suitToSymbol(suit)}
              </button>
            ))}
          </div>

          {selectedSuit && (
            <div className="grid grid-cols-7 gap-1.5">
              {RANKS.map(rank => {
                const card: Card = { suit: selectedSuit, rank };
                const excluded = isExcluded(card, exclude);
                return (
                  <button
                    key={rank}
                    onClick={() => handleRankSelect(rank)}
                    disabled={excluded}
                    className="py-2 rounded-lg text-sm font-bold transition-all"
                    style={{
                      backgroundColor: excluded ? 'rgba(100,100,100,0.2)' : 'var(--surface)',
                      color: excluded ? 'var(--text-muted)' : 'var(--text)',
                      cursor: excluded ? 'not-allowed' : 'pointer',
                      opacity: excluded ? 0.4 : 1,
                    }}
                  >
                    {rankToString(rank)}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => { setSelecting(false); setSelectedSuit(null); }}
              className="flex-1 py-1.5 rounded-xl text-sm transition-colors"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}
            >
              Отмена
            </button>
            {value && (
              <button
                onClick={handleClear}
                className="flex-1 py-1.5 rounded-xl text-sm transition-colors"
                style={{ backgroundColor: 'rgba(127, 29, 29, 0.3)', color: '#f87171' }}
              >
                Очистить
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
