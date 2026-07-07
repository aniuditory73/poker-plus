'use client';

import { useState } from 'react';
import { Recommendation } from '@/lib/poker';

interface Props {
  rec: Recommendation;
  handId?: string;
  onRecordResult?: (handId: string, stackChange: number) => void;
}

const actionLabels: Record<string, string> = {
  fold: 'FOLD',
  call: 'CALL',
  raise: 'RAISE',
};

const actionGradients: Record<string, string> = {
  green: 'linear-gradient(135deg, #22c55e, #16a34a)',
  red: 'linear-gradient(135deg, #ef4444, #dc2626)',
  yellow: 'linear-gradient(135deg, #eab308, #ca8a04)',
};

const borderColors: Record<string, string> = {
  green: 'rgba(34, 197, 94, 0.3)',
  red: 'rgba(239, 68, 68, 0.3)',
  yellow: 'rgba(234, 179, 8, 0.3)',
};

export default function RecommendationCard({ rec, handId, onRecordResult }: Props) {
  const [resultInput, setResultInput] = useState('');
  const [recorded, setRecorded] = useState(false);

  const handleSubmitResult = () => {
    if (!handId || !onRecordResult || !resultInput) return;
    const change = Number(resultInput);
    if (isNaN(change) || change === 0) return;
    onRecordResult(handId, change);
    setRecorded(true);
  };

  return (
    <div className="rounded-2xl p-4 shadow-sm space-y-3"
      style={{ backgroundColor: 'var(--bg-card)', border: '1px solid ' + borderColors[rec.color], animation: 'slideFade 0.3s ease-out' }}>
      <div className="text-center">
        <div className="inline-block px-8 py-3 rounded-2xl text-2xl font-black tracking-widest text-white shadow-lg"
          style={{ background: actionGradients[rec.color], boxShadow: `0 4px 15px ${borderColors[rec.color]}` }}>
          {actionLabels[rec.action]}
        </div>
      </div>

      {rec.handName && (
        <div className="text-center">
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{rec.handName}</span>
          {rec.draws && rec.draws.length > 0 && (
            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>({rec.draws.join(', ')})</span>
          )}
        </div>
      )}

      {rec.action === 'raise' && rec.raiseSize && (
        <div className="text-center">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Рейз: </span>
          <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            {rec.raiseSize === 100 ? 'ALL-IN' : rec.raiseSize + '% банка'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Pot Odds</div>
          <div className="text-xl font-black" style={{ color: 'var(--text)' }}>{rec.potOddsPercent}%</div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{rec.potOddsRatio}</div>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Equity</div>
          <div className={`text-xl font-black ${rec.equity >= rec.potOddsPercent ? 'text-green-400' : 'text-red-400'}`}>
            {rec.equity}%
          </div>
        </div>
      </div>

      {(rec.outs !== undefined || rec.improvementPercent !== undefined) && (
        <div className="grid grid-cols-2 gap-2">
          {rec.outs !== undefined && (
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Ауты</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>{rec.outs}</div>
            </div>
          )}
          {rec.improvementPercent !== undefined && (
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>Усиление</div>
              <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>~{rec.improvementPercent}%</div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--surface)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec.explanation}</p>
      </div>

      {handId && onRecordResult && !recorded && (
        <div className="rounded-xl p-3 space-y-2" style={{ backgroundColor: 'var(--surface)' }}>
          <label className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>Результат раздачи (+/- $)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={resultInput}
              onChange={e => setResultInput(e.target.value)}
              placeholder="+50 или -30"
              className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text)', border: '1px solid var(--border)' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={handleSubmitResult}
              disabled={!resultInput || Number(resultInput) === 0}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-sm"
              style={{
                backgroundColor: !resultInput || Number(resultInput) === 0 ? 'rgba(100,100,100,0.5)' : 'var(--accent)',
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {recorded && (
        <div className="text-center text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Результат сохранён</div>
      )}
    </div>
  );
}
