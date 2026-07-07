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
  return suit === Suit.Hearts || suit === Suit.Diamonds ? '#dc2626' : '#171717';
}

function cardBg(suit: Suit): string {
  return suit === Suit.Hearts || suit === Suit.Diamonds ? 'rgba(220,38,38,0.06)' : 'rgba(0,0,0,0.03)';
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
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>

      <button
        onClick={() => setSelecting(!selecting)}
        className="relative rounded-xl transition-all duration-200 select-none"
        style={{
          width: 62,
          height: 84,
          perspective: 600,
        }}
      >
        <div
          className="w-full h-full rounded-xl flex flex-col items-center justify-center transition-all duration-150"
          style={{
            background: value
              ? 'linear-gradient(145deg, #ffffff, #f5f0e8)'
              : 'var(--surface)',
            border: value
              ? '1px solid rgba(0,0,0,0.12)'
              : '1px dashed var(--border)',
            boxShadow: value
              ? '0 2px 8px var(--card-shadow), inset 0 1px 0 rgba(255,255,255,0.8)'
              : 'none',
            transform: value && selecting ? 'rotateY(6deg)' : 'none',
          }}
        >
          {value ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <span className="absolute top-1 left-1.5 text-[12px] font-bold leading-none" style={{ color: cardColor(value.suit) }}>
                {rankToString(value.rank)}
              </span>
              <span className="text-xl leading-none mt-1" style={{ color: cardColor(value.suit) }}>
                {suitToSymbol(value.suit)}
              </span>
              <span className="absolute bottom-1 right-1.5 text-[12px] font-bold leading-none rotate-180" style={{ color: cardColor(value.suit) }}>
                {rankToString(value.rank)}
              </span>
              <div className="absolute inset-0 rounded-xl" style={{
                background: `radial-gradient(circle at 50% 50%, ${cardBg(value.suit)} 0%, transparent 70%)`,
              }} />
            </div>
          ) : (
            <span className="text-xl font-light transition-all duration-200" style={{ color: 'var(--text-muted)', opacity: selecting ? 0.5 : 1 }}>
              ?
            </span>
          )}
        </div>
      </button>

      {selecting && (
        <div className="rounded-2xl p-4 space-y-3 shadow-2xl border w-full max-w-xs"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
            animation: 'fadeIn 0.15s ease-out',
          }}>
          <div className="flex gap-2 justify-center">
            {SUITS.map(suit => (
              <button
                key={suit}
                onClick={() => handleSuitSelect(suit)}
                className="w-11 h-11 rounded-xl text-xl font-bold transition-all duration-150 flex items-center justify-center"
                style={{
                  backgroundColor: selectedSuit === suit ? '#ffffff' : 'var(--surface)',
                  color: cardColor(suit),
                  boxShadow: selectedSuit === suit ? '0 0 0 2px var(--accent), 0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  transform: selectedSuit === suit ? 'scale(1.1)' : 'none',
                }}
              >
                {suitToSymbol(suit)}
              </button>
            ))}
          </div>

          {selectedSuit && (
            <div className="grid grid-cols-7 gap-1.5" style={{ animation: 'fadeIn 0.12s ease-out' }}>
              {RANKS.map(rank => {
                const card: Card = { suit: selectedSuit, rank };
                const excluded = isExcluded(card, exclude);
                return (
                  <button
                    key={rank}
                    onClick={() => handleRankSelect(rank)}
                    disabled={excluded}
                    className="py-2 rounded-lg text-sm font-bold transition-all duration-100"
                    style={{
                      backgroundColor: excluded ? 'rgba(100,100,100,0.2)' : 'var(--surface)',
                      color: excluded ? 'var(--text-muted)' : cardColor(selectedSuit),
                      cursor: excluded ? 'not-allowed' : 'pointer',
                      opacity: excluded ? 0.35 : 1,
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
              className="flex-1 py-1.5 rounded-xl text-sm transition-colors duration-100"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}
            >
              Отмена
            </button>
            {value && (
              <button
                onClick={handleClear}
                className="flex-1 py-1.5 rounded-xl text-sm transition-colors duration-100"
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
