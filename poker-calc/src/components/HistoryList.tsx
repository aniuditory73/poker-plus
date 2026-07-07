'use client';

import { HandHistory, cardToString } from '@/lib/poker';

interface Props {
  history: HandHistory[];
  onClear: () => void;
}

const streetLabels: Record<string, string> = {
  preflop: 'PF',
  flop: 'FL',
  turn: 'TU',
  river: 'RI',
};

export default function HistoryList({ history, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>История раздач</h3>
        <button onClick={onClear} className="text-[11px] transition-colors" style={{ color: 'rgba(248, 113, 113, 0.7)' }}>
          Очистить
        </button>
      </div>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {history.map(h => (
          <div key={h.id} className="rounded-xl px-3 py-2 flex items-center justify-between text-sm border"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 40%, transparent)', borderColor: 'color-mix(in srgb, var(--border) 10%, transparent)' }}>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--text-muted) 60%, transparent)' }}>
                {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--text)' }}>
                {h.holeCards ? h.holeCards.map(c => cardToString(c)).join(' ') : '??'}
              </span>
              <span className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--text-muted) 60%, transparent)' }}>{h.position}</span>
              <span className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--text-muted) 60%, transparent)' }}>{streetLabels[h.street]}</span>
            </div>
            <span className={`font-bold text-xs ${h.recommendation.action === 'fold' ? 'text-red-400' : 'text-green-400'}`}>
              {h.recommendation.action.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
