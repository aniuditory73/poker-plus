'use client';

import { useState } from 'react';
import { PresetInfo } from './HandPresets';
import { RANKS, RANK_LABELS, EQUITY_MATRIX, cellLabel, getHandRanks, equityColor } from '@/data/handEquity';

interface Props {
  onSelect: (preset: PresetInfo) => void;
  onClose: () => void;
}

export default function RangeGrid({ onSelect, onClose }: Props) {
  const [hover, setHover] = useState<{ i: number; j: number } | null>(null);

  const handleCell = (i: number, j: number) => {
    const { rank1, rank2, suited } = getHandRanks(i, j);
    onSelect({ label: cellLabel(i, j), rank1, rank2, suited });
  };

  return (
    <div className="rounded-2xl p-3 shadow-2xl border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', animation: 'fadeIn 0.2s ease-out' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Range-сетка
        </span>
        <button onClick={onClose} className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}>✕</button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: `20px repeat(13, 1fr)`,
          gap: '1.5px',
          minWidth: 490,
        }}>
          <div />
          {RANKS.map(r => (
            <div key={r} className="text-center text-[8px] font-bold pb-0.5" style={{ color: 'var(--text-muted)' }}>
              {RANK_LABELS[r]}
            </div>
          ))}

          {RANKS.map((r, i) => (
            <span key={`row-${i}`} style={{ display: 'contents' }}>
              <div className="text-[8px] font-bold flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                {RANK_LABELS[r]}
              </div>
              {RANKS.map((_, j) => {
                const eq = EQUITY_MATRIX[i][j];
                const isHover = hover?.i === i && hover?.j === j;
                const hl = cellLabel(i, j);
                const isPair = i === j;
                return (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => handleCell(i, j)}
                    onMouseEnter={() => setHover({ i, j })}
                    onMouseLeave={() => setHover(null)}
                    className="rounded text-[8px] font-bold leading-tight transition-all duration-100 select-none"
                    style={{
                      backgroundColor: equityColor(eq),
                      color: eq > 55 ? 'white' : 'rgba(0,0,0,0.8)',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: isHover ? '2px solid var(--accent)' : 'none',
                      outlineOffset: '-1px',
                      transform: isHover ? 'scale(1.12)' : 'none',
                      zIndex: isHover ? 2 : 0,
                      position: 'relative',
                      filter: isPair && !isHover ? 'brightness(1.08)' : 'none',
                      boxShadow: isHover ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                      borderRadius: 3,
                    }}
                  >
                    {hl}
                  </button>
                );
              })}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[7px]" style={{ color: 'var(--text-muted)' }}>Слабая</span>
          <div className="h-1.5 rounded-full" style={{
            width: 70,
            background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
          }} />
          <span className="text-[7px]" style={{ color: 'var(--text-muted)' }}>Сильная</span>
        </div>
        {hover && (
          <span className="text-[10px] font-bold" style={{ color: 'var(--text)', animation: 'fadeIn 0.1s ease-out' }}>
            {cellLabel(hover.i, hover.j)} — {EQUITY_MATRIX[hover.i][hover.j]}%
          </span>
        )}
      </div>
    </div>
  );
}
