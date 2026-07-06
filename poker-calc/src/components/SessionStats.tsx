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
    <div className="bg-[#1a2c38]/60 backdrop-blur-sm rounded-2xl p-4 border border-[#2a4a5a]/20 shadow-sm space-y-3">
      <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium">Статистика сессии</h3>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-[#0f1923]/40 rounded-xl py-2">
          <div className="text-lg font-black text-white">{total}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Всего</div>
        </div>
        <div className="bg-[#0f1923]/40 rounded-xl py-2">
          <div className="text-lg font-black text-red-400">{total > 0 ? Math.round(folds / total * 100) : 0}%</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Fold</div>
        </div>
        <div className="bg-[#0f1923]/40 rounded-xl py-2">
          <div className="text-lg font-black text-yellow-400">{total > 0 ? Math.round(calls / total * 100) : 0}%</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Call</div>
        </div>
        <div className="bg-[#0f1923]/40 rounded-xl py-2">
          <div className="text-lg font-black text-green-400">{total > 0 ? Math.round(raises / total * 100) : 0}%</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Raise</div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#0f1923]/40 rounded-xl px-3 py-2">
        <span className="text-xs text-gray-500">Текущий стек</span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-black ${pnlColor}`}>${currentStack}</span>
          <span className={`text-xs font-bold ${pnlColor}`}>
            {pnl >= 0 ? '+' : ''}{pnl}
          </span>
        </div>
      </div>

      {hasStackData && (
        <div className="space-y-1">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Изменение стека</div>
          <div className="flex items-end gap-0.5 h-12">
            {stackPoints.map((val, i) => {
              const height = ((val - minStack) / stackRange) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${Math.max(height, 3)}%`,
                    background: i === 0
                      ? '#2d9cdb'
                      : val >= stackPoints[i - 1]
                        ? 'linear-gradient(to top, #22c55e, #16a34a)'
                        : 'linear-gradient(to top, #ef4444, #dc2626)',
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
