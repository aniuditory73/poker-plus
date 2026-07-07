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
    <div className="rounded-2xl p-4 shadow-sm space-y-3"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <h3 className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>Статистика сессии</h3>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          ['Всего', total, 'var(--text)'],
          ['Fold', total > 0 ? Math.round(folds / total * 100) + '%' : '0%', '#f87171'],
          ['Call', total > 0 ? Math.round(calls / total * 100) + '%' : '0%', '#fbbf24'],
          ['Raise', total > 0 ? Math.round(raises / total * 100) + '%' : '0%', '#34d399'],
        ].map(([label, val, color]) => (
          <div key={label as string} className="rounded-xl py-2" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-lg font-black" style={{ color: color as string }}>{val}</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label as string}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--surface)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Текущий стек</span>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-black ${pnlColor}`}>${currentStack}</span>
          <span className={`text-xs font-bold ${pnlColor}`}>
            {pnl >= 0 ? '+' : ''}{pnl}
          </span>
        </div>
      </div>

      {hasStackData && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Изменение стека</div>
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
                      ? 'var(--accent)'
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
