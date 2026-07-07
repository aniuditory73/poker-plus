'use client';

import { useState, useMemo } from 'react';
import { HandHistory } from '@/lib/poker';

interface Props {
  history: HandHistory[];
  startingStack: number;
  currentStack: number;
}

const PAD = { top: 20, right: 16, bottom: 28, left: 48 };
const W = 400;
const H = 180;
const CW = W - PAD.left - PAD.right;
const CH = H - PAD.top - PAD.bottom;

function toSvgX(i: number, n: number): number {
  if (n <= 1) return PAD.left + CW / 2;
  return PAD.left + (i / (n - 1)) * CW;
}

function toSvgY(v: number, min: number, max: number): number {
  return PAD.top + CH - ((v - min) / (max - min || 1)) * CH;
}

function formatMoney(v: number): string {
  const sign = v >= 0 ? '+' : '';
  return `${sign}$${v}`;
}

function StackChart({ data }: { data: number[] }) {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = range * 0.1;
  const yMin = min - pad;
  const yMax = max + pad;

  const points = data.map((v, i) => `${toSvgX(i, n)},${toSvgY(v, yMin, yMax)}`);
  const areaPoints = `${PAD.left},${PAD.top + CH} ` + points.join(' ') + ` ${toSvgX(n - 1, n)},${PAD.top + CH}`;

  const yTicks = [
    { v: max, label: `$${Math.round(max)}` },
    { v: min, label: `$${Math.round(min)}` },
    { v: data[data.length - 1], label: `$${Math.round(data[data.length - 1])}`, current: true },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="stackFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {yTicks.filter(t => !t.current).map(t => (
        <line key={t.v} x1={PAD.left} y1={toSvgY(t.v, yMin, yMax)} x2={PAD.left + CW} y2={toSvgY(t.v, yMin, yMax)}
          stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
      ))}

      <polygon points={areaPoints} fill="url(#stackFill)" />
      <polyline points={points.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {data.map((v, i) => (
        <circle key={i} cx={toSvgX(i, n)} cy={toSvgY(v, yMin, yMax)} r="2.5" fill="var(--accent)" stroke="var(--bg-card)" strokeWidth="1" />
      ))}

      <text x={PAD.left - 6} y={toSvgY(max, yMin, yMax) + 4} textAnchor="end" fontSize="9" fill="var(--text-muted)">{yTicks[0].label}</text>
      <text x={PAD.left - 6} y={toSvgY(min, yMin, yMax) + 4} textAnchor="end" fontSize="9" fill="var(--text-muted)">{yTicks[1].label}</text>

      {n > 1 && (
        <>
          <text x={toSvgX(0, n)} y={PAD.top + CH + 16} textAnchor="middle" fontSize="8" fill="var(--text-muted)">1</text>
          <text x={toSvgX(n - 1, n)} y={PAD.top + CH + 16} textAnchor="middle" fontSize="8" fill="var(--text-muted)">{n}</text>
        </>
      )}
    </svg>
  );
}

function WinLossChart({ data }: { data: number[] }) {
  const n = data.length;
  const absMax = Math.max(...data.map(Math.abs), 1);
  const yMin = -absMax * 1.15;
  const yMax = absMax * 1.15;
  const zeroY = toSvgY(0, yMin, yMax);
  const barWidth = Math.min(24, (CW / n) * 0.7);

  const positiveMax = Math.max(...data.filter(v => v > 0).map(Math.abs), 1);
  const negativeMax = Math.max(...data.filter(v => v < 0).map(Math.abs), 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="winGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <line x1={PAD.left} y1={zeroY} x2={PAD.left + CW} y2={zeroY} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4,4" />

      <text x={PAD.left - 6} y={zeroY + 3} textAnchor="end" fontSize="8" fill="var(--text-muted)">0</text>
      <text x={PAD.left - 6} y={toSvgY(positiveMax, yMin, yMax) + 3} textAnchor="end" fontSize="9" fill="#22c55e">{`+$${positiveMax}`}</text>
      <text x={PAD.left - 6} y={toSvgY(-negativeMax, yMin, yMax) + 3} textAnchor="end" fontSize="9" fill="#ef4444">{`-$${negativeMax}`}</text>

      {data.map((v, i) => {
        const cx = toSvgX(i, n);
        const barH = Math.abs(toSvgY(v, yMin, yMax) - zeroY);
        const y = v >= 0 ? zeroY - barH : zeroY;
        return (
          <rect key={i} x={cx - barWidth / 2} y={y} width={barWidth} height={Math.max(barH, 1)} rx="2"
            fill={v >= 0 ? 'url(#winGrad)' : 'url(#lossGrad)'} />
        );
      })}

      {n > 1 && (
        <>
          <text x={toSvgX(0, n)} y={PAD.top + CH + 16} textAnchor="middle" fontSize="8" fill="var(--text-muted)">1</text>
          <text x={toSvgX(n - 1, n)} y={PAD.top + CH + 16} textAnchor="middle" fontSize="8" fill="var(--text-muted)">{n}</text>
        </>
      )}
    </svg>
  );
}

export default function SessionChart({ history, startingStack, currentStack }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'stack' | 'winloss'>('stack');

  const recorded = useMemo(() => {
    return history.filter(h => h.stackChange !== undefined).reverse();
  }, [history]);

  const stackData = useMemo(() => {
    let running = startingStack;
    return recorded.map(h => {
      running += h.stackChange!;
      return running;
    });
  }, [recorded, startingStack]);

  const winLossData = useMemo(() => {
    return recorded.map(h => h.stackChange as number);
  }, [recorded]);

  const totalProfit = currentStack - startingStack;

  if (recorded.length < 1) return null;

  return (
    <div className="rounded-2xl shadow-sm px-4 py-4"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1 p-0.5 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
          <button onClick={() => setChartType('stack')}
            className="px-3 py-1 rounded-md text-xs font-bold transition-all"
            style={{
              backgroundColor: chartType === 'stack' ? 'var(--accent)' : 'transparent',
              color: chartType === 'stack' ? 'white' : 'var(--text-muted)',
            }}>
            Стек
          </button>
          <button onClick={() => setChartType('winloss')}
            className="px-3 py-1 rounded-md text-xs font-bold transition-all"
            style={{
              backgroundColor: chartType === 'winloss' ? 'var(--accent)' : 'transparent',
              color: chartType === 'winloss' ? 'white' : 'var(--text-muted)',
            }}>
            +/-
          </button>
        </div>
        <div className="text-right">
          <div className="text-lg font-black" style={{ color: totalProfit >= 0 ? '#22c55e' : '#ef4444' }}>
            {formatMoney(totalProfit)}
          </div>
        </div>
      </div>

      <div className="relative select-none"
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = x / rect.width;
          const i = Math.round(pct * (recorded.length - 1));
          setHoverIdx(Math.max(0, Math.min(recorded.length - 1, i)));
        }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <div className="w-full" style={{ height: 150 }}>
          {chartType === 'stack' ? <StackChart data={stackData} /> : <WinLossChart data={winLossData} />}
        </div>

        {hoverIdx !== null && (
          <div className="absolute pointer-events-none z-10" style={{
            left: `${(PAD.left / W + (hoverIdx / Math.max(recorded.length - 1, 1)) * (CW / W)) * 100}%`,
            top: 0,
            transform: 'translateX(-50%)',
          }}>
            <div className="rounded-lg shadow-lg px-2.5 py-1.5 text-xs whitespace-nowrap"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Раздача #{hoverIdx + 1}</div>
              {chartType === 'stack' ? (
                <div className="font-bold" style={{ color: 'var(--text)' }}>Стек: ${Math.round(stackData[hoverIdx])}</div>
              ) : (
                <div className="font-bold" style={{ color: winLossData[hoverIdx] >= 0 ? '#22c55e' : '#ef4444' }}>
                  {formatMoney(winLossData[hoverIdx])}
                </div>
              )}
              <div style={{ color: 'var(--text-muted)' }}>
                Изм.: {formatMoney(recorded[hoverIdx].stackChange!)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
