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
      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{label}</span>

      <button
        onClick={() => setSelecting(!selecting)}
        className={`w-14 h-20 rounded-xl flex flex-col items-center justify-center transition-all select-none ${
          value
            ? 'bg-white shadow-md shadow-black/20 border border-gray-200/80'
            : 'bg-[#0f1923]/60 border border-dashed border-[#2a4a5a]/40 hover:border-[#2d9cdb]/40'
        }`}
      >
        {value ? (
          <div className="relative w-full h-full">
            <span className={`absolute top-0.5 left-1 text-[11px] font-bold leading-none ${value.suit === Suit.Hearts || value.suit === Suit.Diamonds ? 'text-red-500' : 'text-gray-900'}`}>
              {rankToString(value.rank)}
            </span>
            <span className={`absolute inset-0 flex items-center justify-center text-lg leading-none ${value.suit === Suit.Hearts || value.suit === Suit.Diamonds ? 'text-red-500' : 'text-gray-900'}`}>
              {suitToSymbol(value.suit)}
            </span>
            <span className={`absolute bottom-0.5 right-1 text-[11px] font-bold leading-none rotate-180 ${value.suit === Suit.Hearts || value.suit === Suit.Diamonds ? 'text-red-500' : 'text-gray-900'}`}>
              {rankToString(value.rank)}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 text-xl font-light">?</span>
        )}
      </button>

      {selecting && (
        <div className="bg-[#1a2c38] rounded-2xl p-4 space-y-3 shadow-2xl border border-[#2a4a5a]/30 w-full max-w-xs">
          <div className="flex gap-2 justify-center">
            {SUITS.map(suit => (
              <button
                key={suit}
                onClick={() => handleSuitSelect(suit)}
                className={`w-11 h-11 rounded-xl text-xl font-bold transition-all flex items-center justify-center ${
                  selectedSuit === suit
                    ? 'ring-2 ring-[#2d9cdb] scale-110 bg-white'
                    : 'hover:scale-105 bg-white/90'
                } ${suit === Suit.Hearts || suit === Suit.Diamonds ? 'text-red-500' : 'text-gray-900'}`}
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
                        ? 'bg-gray-700/30 text-gray-600 cursor-not-allowed'
                        : 'bg-[#0f1923]/80 text-gray-200 hover:bg-[#2a4a5a]/40 hover:text-white'
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
              className="flex-1 py-1.5 rounded-xl text-sm bg-[#0f1923]/60 text-gray-400 hover:text-white transition-colors"
            >
              Отмена
            </button>
            {value && (
              <button
                onClick={handleClear}
                className="flex-1 py-1.5 rounded-xl text-sm bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
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
