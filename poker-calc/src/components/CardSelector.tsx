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

export default function CardSelector({ label, value, onChange, exclude }: Props) {
  const [selecting, setSelecting] = useState(false);
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);

  const handleSuitSelect = (suit: Suit) => {
    setSelectedSuit(suit);
  };

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
      <span className="text-xs text-gray-400">{label}</span>

      <button
        onClick={() => setSelecting(!selecting)}
        className={`w-14 h-20 rounded-lg flex flex-col items-center justify-center transition-all select-none ${
          value
            ? 'bg-white border border-gray-200 shadow-sm'
            : 'bg-gray-700 border border-dashed border-gray-500 hover:border-gray-400'
        }`}
      >
        {value ? (
          <div className="relative w-full h-full">
            <span className={`absolute top-0.5 left-1 text-[11px] font-bold leading-none ${value.suit === Suit.Hearts || value.suit === Suit.Diamonds ? 'text-red-500' : 'text-black'}`}>
              {rankToString(value.rank)}
            </span>
            <span className={`absolute inset-0 flex items-center justify-center text-lg leading-none ${value.suit === Suit.Hearts || value.suit === Suit.Diamonds ? 'text-red-500' : 'text-black'}`}>
              {suitToSymbol(value.suit)}
            </span>
            <span className={`absolute bottom-0.5 right-1 text-[11px] font-bold leading-none rotate-180 ${value.suit === Suit.Hearts || value.suit === Suit.Diamonds ? 'text-red-500' : 'text-black'}`}>
              {rankToString(value.rank)}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-2xl font-light">?</span>
        )}
      </button>

      {selecting && (
        <div className="bg-gray-800 rounded-xl p-3 space-y-3 shadow-xl border border-gray-700 w-full max-w-xs">
          <div className="flex gap-2 justify-center">
            {SUITS.map(suit => (
              <button
                key={suit}
                onClick={() => handleSuitSelect(suit)}
                className={`w-11 h-11 rounded-lg text-xl font-bold transition-all flex items-center justify-center ${
                  selectedSuit === suit
                    ? 'ring-2 ring-blue-400 scale-110'
                    : 'hover:scale-105'
                } bg-white ${suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-500' : 'text-black'}`}
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
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${
                      excluded
                        ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105'
                    }`}
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
              className="flex-1 py-1.5 rounded-lg text-sm bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Отмена
            </button>
            {value && (
              <button
                onClick={handleClear}
                className="flex-1 py-1.5 rounded-lg text-sm bg-red-900 text-red-300 hover:bg-red-800"
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
