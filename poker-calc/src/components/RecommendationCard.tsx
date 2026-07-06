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

const actionBtnColors: Record<string, string> = {
  green: 'bg-green-600 text-white',
  red: 'bg-red-600 text-white',
  yellow: 'bg-yellow-500 text-black',
};

const bgColors: Record<string, string> = {
  green: 'bg-green-900/30 border-green-500',
  red: 'bg-red-900/30 border-red-500',
  yellow: 'bg-yellow-900/30 border-yellow-500',
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
    <div className={`rounded-xl p-4 border-2 ${bgColors[rec.color]} space-y-3`}>
      <div className="text-center">
        <div className={`inline-block px-6 py-3 rounded-2xl text-2xl font-black tracking-wider ${actionBtnColors[rec.color]}`}>
          {actionLabels[rec.action]}
        </div>
      </div>

      {rec.handName && (
        <div className="text-center">
          <span className="text-sm font-bold text-gray-200">{rec.handName}</span>
          {rec.draws && rec.draws.length > 0 && (
            <span className="text-xs text-gray-400 ml-2">({rec.draws.join(', ')})</span>
          )}
        </div>
      )}

      {rec.action === 'raise' && rec.raiseSize && (
        <div className="text-center">
          <span className="text-sm text-gray-300">Рейз: </span>
          <span className="text-lg font-bold text-white">
            {rec.raiseSize === 100 ? 'ALL-IN' : rec.raiseSize + '% банка'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Pot Odds</div>
          <div className="text-lg font-bold text-white">{rec.potOddsPercent}%</div>
          <div className="text-xs text-gray-500">{rec.potOddsRatio}</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Equity</div>
          <div className={`text-lg font-bold ${rec.equity >= rec.potOddsPercent ? 'text-green-400' : 'text-red-400'}`}>
            {rec.equity}%
          </div>
        </div>
      </div>

      {(rec.outs !== undefined || rec.improvementPercent !== undefined) && (
        <div className="grid grid-cols-2 gap-3">
          {rec.outs !== undefined && (
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Ауты</div>
              <div className="text-lg font-bold text-white">{rec.outs}</div>
            </div>
          )}
          {rec.improvementPercent !== undefined && (
            <div className="bg-gray-800 rounded-lg p-2 text-center">
              <div className="text-xs text-gray-400 mb-1">Усиление</div>
              <div className="text-lg font-bold text-blue-400">~{rec.improvementPercent}%</div>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-3">
        <p className="text-sm text-gray-300 leading-relaxed">{rec.explanation}</p>
      </div>

      {handId && onRecordResult && !recorded && (
        <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
          <label className="text-xs text-gray-400">Результат раздачи (+/- $)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={resultInput}
              onChange={e => setResultInput(e.target.value)}
              placeholder="+50 или -30"
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSubmitResult}
              disabled={!resultInput || Number(resultInput) === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-bold transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {recorded && (
        <div className="text-center text-xs text-gray-500">Результат сохранён</div>
      )}
    </div>
  );
}
