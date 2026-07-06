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
        <h3 className="text-sm font-bold text-gray-400">История раздач</h3>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Очистить
        </button>
      </div>
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {history.map(h => (
          <div
            key={h.id}
            className="bg-gray-800/50 rounded-lg px-3 py-2 flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-gray-300 font-mono text-xs">
                {h.holeCards ? h.holeCards.map(c => cardToString(c)).join(' ') : '??'}
              </span>
              <span className="text-gray-500 text-xs">{h.position}</span>
              <span className="text-gray-500 text-xs">{streetLabels[h.street]}</span>
            </div>
            <span className={`font-bold text-sm ${actionColors[h.recommendation.action]}`}>
              {h.recommendation.action.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
