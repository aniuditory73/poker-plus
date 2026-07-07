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
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Range-сетка
        </span>
        <button onClick={onClose} className="text-xs" style={{ color: 'var(--text-muted)' }}>Закрыть</button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: `22px repeat(13, minmax(36px, 1fr))`,
          gap: '1px',
          minWidth: 500,
        }}>
          <div />
          {RANKS.map(r => (
            <div key={r} className="text-center text-[9px] font-bold py-0.5" style={{ color: 'var(--text-muted)' }}>
              {RANK_LABELS[r]}
            </div>
          ))}

          {RANKS.map((r, i) => (
            <>
              <div key={`lbl-${i}`} className="text-[9px] font-bold flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
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
                    className="rounded-sm text-[9px] font-bold leading-tight transition-all select-none"
                    style={{
                      backgroundColor: equityColor(eq),
                      color: eq > 55 ? 'white' : 'rgba(0,0,0,0.8)',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      outline: isHover ? '2px solid var(--accent)' : 'none',
                      outlineOffset: '-1px',
                      transform: isHover ? 'scale(1.08)' : 'none',
                      zIndex: isHover ? 1 : 0,
                      position: 'relative',
                      filter: isPair && !isHover ? 'brightness(1.1)' : 'none',
                    }}
                  >
                    {hl}
                  </button>
                );
              })}
            </>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>Слабая</span>
          <div className="h-2 rounded-full" style={{
            width: 80,
            background: 'linear-gradient(to right, #ef4444, #eab308, #22c55e)',
          }} />
          <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>Сильная</span>
        </div>
        {hover && (
          <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>
            {cellLabel(hover.i, hover.j)} — {EQUITY_MATRIX[hover.i][hover.j]}%
          </span>
        )}
      </div>
    </div>
  );
}
