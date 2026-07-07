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
  return suit === Suit.Hearts || suit === Suit.Diamonds ? '#dc2626' : '#171717';
}

function PokerCard({ rank, suit, selected }: { rank: Rank; suit: Suit; selected?: boolean }) {
  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center transition-all duration-150"
      style={{
        width: 58,
        height: 78,
        background: 'linear-gradient(145deg, #ffffff, #f5f0e8)',
        border: selected ? '2px solid var(--accent)' : '1px solid rgba(0,0,0,0.1)',
        boxShadow: selected
          ? '0 0 0 2px var(--accent), 0 4px 12px rgba(0,0,0,0.2)'
          : '0 2px 6px var(--card-shadow), inset 0 1px 0 rgba(255,255,255,0.8)',
        transform: selected ? 'scale(1.05)' : 'none',
      }}
    >
      <span className="text-[13px] font-bold leading-none" style={{ color: cardColor(suit) }}>
        {rankToString(rank)}
      </span>
      <span className="text-xl leading-none mt-0.5" style={{ color: cardColor(suit) }}>
        {suitToSymbol(suit)}
      </span>
    </div>
  );
}

export default function PresetSuitPicker({ preset, onConfirm, onCancel }: Props) {
  const [suit1, setSuit1] = useState<Suit | null>(null);
  const [suit2, setSuit2] = useState<Suit | null>(null);

  if (preset.suited) {
    return (
      <div className="space-y-2" style={{ animation: 'slideUp 0.2s ease-out' }}>
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
              className="transition-all duration-150 hover:scale-105"
            >
              <div
                className="rounded-xl flex flex-col items-center justify-center"
                style={{
                  width: 64,
                  height: 88,
                  background: 'linear-gradient(145deg, #ffffff, #f5f0e8)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 2px 8px var(--card-shadow), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                <span className="text-[13px] font-bold" style={{ color: cardColor(suit) }}>
                  {rankToString(preset.rank1)}
                </span>
                <span className="text-sm" style={{ color: cardColor(suit) }}>
                  {suitToSymbol(suit)}
                </span>
                <span className="text-[13px] font-bold" style={{ color: cardColor(suit) }}>
                  {rankToString(preset.rank2)}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button onClick={onCancel} className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>Отмена</button>
        </div>
      </div>
    );
  }

  const secondSuits = suit1 ? ALL_SUITS.filter(s => s !== suit1) : ALL_SUITS;

  return (
    <div className="space-y-3" style={{ animation: 'slideUp 0.2s ease-out' }}>
      <div className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
        Масти для {preset.label}
      </div>
      <div className="grid grid-cols-2 gap-6 justify-items-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Карта 1</span>
          {ALL_SUITS.map(suit => (
            <button key={suit} onClick={() => { setSuit1(suit); setSuit2(null); }}
              className="transition-all duration-150 hover:scale-105"
            >
              <PokerCard rank={preset.rank1} suit={suit} selected={suit1 === suit} />
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Карта 2</span>
          {secondSuits.map(suit => (
            <button key={suit} onClick={() => setSuit2(suit)}
              className="transition-all duration-150 hover:scale-105"
            >
              <PokerCard rank={preset.rank2} suit={suit} selected={suit2 === suit} />
            </button>
          ))}
        </div>
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
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all duration-150"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Подтвердить
          </button>
        )}
      </div>
    </div>
  );
}
