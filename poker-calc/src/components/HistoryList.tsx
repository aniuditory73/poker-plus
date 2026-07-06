'use client';

import { HandHistory, cardToString } from '@/lib/poker';

interface Props {
  history: HandHistory[];
  onClear: () => void;
}

const actionColors: Record<string, string> = {
  fold: 'text-red-400',
  call: 'text-green-400',
  raise: 'text-green-400',
};

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
        <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">История раздач</h3>
        <button
          onClick={onClear}
          className="text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
        >
          Очистить
        </button>
      </div>
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {history.map(h => (
          <div
            key={h.id}
            className="bg-[#1a2c38]/40 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center justify-between text-sm border border-[#2a4a5a]/10"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-600">
                {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-gray-300 font-mono text-xs">
                {h.holeCards ? h.holeCards.map(c => cardToString(c)).join(' ') : '??'}
              </span>
              <span className="text-gray-600 text-[10px]">{h.position}</span>
              <span className="text-gray-600 text-[10px]">{streetLabels[h.street]}</span>
            </div>
            <span className={`font-bold text-xs ${actionColors[h.recommendation.action]}`}>
              {h.recommendation.action.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
