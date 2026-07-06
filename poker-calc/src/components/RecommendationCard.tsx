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

const actionColors: Record<string, string> = {
  green: 'from-green-500 to-green-700 shadow-green-500/30',
  red: 'from-red-500 to-red-700 shadow-red-500/30',
  yellow: 'from-yellow-400 to-yellow-600 shadow-yellow-400/30',
};

const borderColors: Record<string, string> = {
  green: 'border-green-500/30',
  red: 'border-red-500/30',
  yellow: 'border-yellow-500/30',
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
    <div className={`rounded-2xl p-4 border ${borderColors[rec.color]} bg-[#1a2c38]/60 backdrop-blur-sm shadow-sm space-y-3`}>
      <div className="text-center">
        <div className={`inline-block px-8 py-3 rounded-2xl text-2xl font-black tracking-widest bg-gradient-to-r ${actionColors[rec.color]} text-white shadow-lg`}>
          {actionLabels[rec.action]}
        </div>
      </div>

      {rec.handName && (
        <div className="text-center">
          <span className="text-sm font-bold text-gray-200">{rec.handName}</span>
          {rec.draws && rec.draws.length > 0 && (
            <span className="text-xs text-gray-500 ml-2">({rec.draws.join(', ')})</span>
          )}
        </div>
      )}

      {rec.action === 'raise' && rec.raiseSize && (
        <div className="text-center">
          <span className="text-sm text-gray-400">Рейз: </span>
          <span className="text-lg font-bold text-white">
            {rec.raiseSize === 100 ? 'ALL-IN' : rec.raiseSize + '% банка'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0f1923]/60 rounded-xl p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Pot Odds</div>
          <div className="text-xl font-black text-white">{rec.potOddsPercent}%</div>
          <div className="text-[10px] text-gray-500">{rec.potOddsRatio}</div>
        </div>
        <div className="bg-[#0f1923]/60 rounded-xl p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Equity</div>
          <div className={`text-xl font-black ${rec.equity >= rec.potOddsPercent ? 'text-green-400' : 'text-red-400'}`}>
            {rec.equity}%
          </div>
        </div>
      </div>

      {(rec.outs !== undefined || rec.improvementPercent !== undefined) && (
        <div className="grid grid-cols-2 gap-2">
          {rec.outs !== undefined && (
            <div className="bg-[#0f1923]/60 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Ауты</div>
              <div className="text-lg font-bold text-white">{rec.outs}</div>
            </div>
          )}
          {rec.improvementPercent !== undefined && (
            <div className="bg-[#0f1923]/60 rounded-xl p-2.5 text-center">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Усиление</div>
              <div className="text-lg font-bold text-[#2d9cdb]">~{rec.improvementPercent}%</div>
            </div>
          )}
        </div>
      )}

      <div className="bg-[#0f1923]/40 rounded-xl p-3">
        <p className="text-sm text-gray-400 leading-relaxed">{rec.explanation}</p>
      </div>

      {handId && onRecordResult && !recorded && (
        <div className="bg-[#0f1923]/40 rounded-xl p-3 space-y-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Результат раздачи (+/- $)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={resultInput}
              onChange={e => setResultInput(e.target.value)}
              placeholder="+50 или -30"
              className="flex-1 bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
            />
            <button
              onClick={handleSubmitResult}
              disabled={!resultInput || Number(resultInput) === 0}
              className="px-5 py-2 bg-[#2d9cdb] hover:bg-[#268cc7] disabled:bg-gray-600/50 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {recorded && (
        <div className="text-center text-[10px] text-gray-500 uppercase tracking-wider">Результат сохранён</div>
      )}
    </div>
  );
}
