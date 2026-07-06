'use client';

import { HandHistory } from '@/lib/poker';

interface Props {
  history: HandHistory[];
  currentStack: number;
  startingStack: number;
}

export default function SessionStats({ history, currentStack, startingStack }: Props) {
  if (history.length === 0) return null;

  const total = history.length;
  const folds = history.filter(h => h.recommendation.action === 'fold').length;
  const calls = history.filter(h => h.recommendation.action === 'call').length;
  const raises = history.filter(h => h.recommendation.action === 'raise').length;

  const stackChanges = history
    .filter(h => h.stackChange !== undefined && h.stackChange !== 0)
    .map(h => h.stackChange as number)
    .reverse();

  const hasStackData = stackChanges.length > 0;

  let runningStack = startingStack;
  const stackPoints = [startingStack];
  for (const change of stackChanges) {
    runningStack += change;
    stackPoints.push(runningStack);
  }

  const maxStack = Math.max(...stackPoints, startingStack);
  const minStack = Math.min(...stackPoints, startingStack);
  const stackRange = maxStack - minStack || 1;

  const pnl = currentStack - startingStack;
  const pnlColor = pnl >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-800/50 rounded-xl p-3 space-y-3">
      <h3 className="text-sm font-bold text-gray-400">Статистика сессии</h3>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-lg font-bold text-white">{total}</div>
          <div className="text-xs text-gray-400">Раздач</div>
        </div>
        <div>
          <div className="text-lg font-bold text-red-400">{total > 0 ? Math.round(folds / total * 100) : 0}%</div>
          <div className="text-xs text-gray-400">Fold</div>
        </div>
        <div>
          <div className="text-lg font-bold text-yellow-400">{total > 0 ? Math.round(calls / total * 100) : 0}%</div>
          <div className="text-xs text-gray-400">Call</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-400">{total > 0 ? Math.round(raises / total * 100) : 0}%</div>
          <div className="text-xs text-gray-400">Raise</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Текущий стек:</span>
        <span className={`text-lg font-bold ${pnlColor}`}>${currentStack}</span>
        <span className={`text-xs ${pnlColor}`}>
          {pnl >= 0 ? '+' : ''}{pnl}
        </span>
      </div>

      {hasStackData && (
        <div className="space-y-1">
          <div className="text-xs text-gray-400">Изменение стека</div>
          <div className="flex items-end gap-0.5 h-12">
            {stackPoints.map((val, i) => {
              const height = ((val - minStack) / stackRange) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${Math.max(height, 3)}%`,
                    backgroundColor: i === 0
                      ? '#3b82f6'
                      : val >= stackPoints[i - 1]
                        ? '#22c55e'
                        : '#ef4444',
                  }}
                  title={`$${val}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
