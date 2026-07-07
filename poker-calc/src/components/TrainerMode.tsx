'use client';

import { Suit, Rank, rankToString, suitToSymbol } from '@/lib/poker';
import { TrainerScenario } from '@/lib/poker/trainer';
import { useEffect } from 'react';

interface Props {
  scenario: TrainerScenario;
  state: 'playing' | 'answered';
  correct: boolean | null;
  score: { total: number; correct: number; streak: number; bestStreak: number };
  onFold: () => void;
  onCall: () => void;
  onRaise: () => void;
  onNext: () => void;
}

function cardColor(suit: Suit): string {
  return suit === Suit.Hearts || suit === Suit.Diamonds ? '#dc2626' : '#171717';
}

function MiniCard({ rank, suit, small }: { rank: number; suit: Suit; small?: boolean }) {
  const sz = small ? { width: 36, height: 48 } : { width: 58, height: 78 };
  return (
    <div
      className="rounded-xl flex flex-col items-center justify-center"
      style={{
        ...sz,
        background: 'linear-gradient(145deg, #ffffff, #f5f0e8)',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 6px var(--card-shadow), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      <span className={small ? 'text-[11px]' : 'text-[13px]'} style={{ fontWeight: 700, color: cardColor(suit), lineHeight: 1 }}>
        {rankToString(rank as Rank)}
      </span>
      <span className={small ? 'text-sm' : 'text-xl'} style={{ color: cardColor(suit), lineHeight: 1, marginTop: small ? 0 : 1 }}>
        {suitToSymbol(suit)}
      </span>
    </div>
  );
}

const ACTION_LABELS: Record<string, string> = { fold: 'FOLD', call: 'CALL', raise: 'RAISE' };
const ACTION_COLORS: Record<string, string> = { fold: '#ef4444', call: '#22c55e', raise: '#22c55e' };

export default function TrainerMode({
  scenario, state, correct, score, onFold, onCall, onRaise, onNext,
}: Props) {
  const { params, recommendation } = scenario;
  const { holeCards, boardCards, position, street, potSize, betToCall, remainingPlayers } = params;

  const canAct = state === 'playing';
  const answered = state === 'answered';

  useEffect(() => {
    if (correct === null && answered) {
    }
  }, [correct, answered]);

  return (
    <div className="space-y-3" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="rounded-2xl p-3 flex items-center justify-between"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-lg">✅</span>
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            {score.correct}/{score.total}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {score.total > 0 ? Math.round(score.correct / score.total * 100) : 0}%
          </span>
        </div>
        {score.streak > 1 && (
          <div className="flex items-center gap-1">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{score.streak}</span>
          </div>
        )}
      </div>

      <div className="rounded-2xl p-4 space-y-3"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
        <div className="text-center">
          <div className="flex justify-center gap-2">
            {holeCards?.map((card, i) => (
              <MiniCard key={i} rank={card.rank} suit={card.suit} />
            ))}
          </div>
        </div>

        {boardCards.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Доска <span className="font-normal">({street === 'flop' ? 'Флоп' : street === 'turn' ? 'Тёрн' : 'Ривер'})</span>
              </span>
            </div>
            <div className="flex gap-1.5 justify-center">
              {boardCards.map((card, i) => (
                <MiniCard key={i} rank={card.rank} suit={card.suit} small />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Позиция</div>
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{position}</div>
          </div>
          <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Пот</div>
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>${potSize}</div>
          </div>
          <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ставка</div>
            <div className="text-sm font-bold" style={{ color: '#f87171' }}>${betToCall}</div>
          </div>
          <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Стек</div>
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>${scenario.setup.currentStack}</div>
          </div>
          <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Игроков</div>
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{remainingPlayers}</div>
          </div>
          <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>BB</div>
            <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>${scenario.setup.bigBlind}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {['fold', 'call', 'raise'].map(action => {
            let bg = canAct ? 'var(--surface)' : ACTION_COLORS[action];
            let txt = canAct ? 'var(--text)' : '#fff';
            let border = '1px solid var(--border)';

            if (answered) {
              if (action === recommendation.action) {
                bg = ACTION_COLORS[action];
                txt = '#fff';
                border = 'none';
              } else {
                bg = 'rgba(100,100,100,0.15)';
                txt = 'var(--text-muted)';
                border = '1px solid rgba(100,100,100,0.1)';
                if (correct === false && action === params.opponentAction) {
                  bg = '#ef4444';
                  txt = '#fff';
                  border = 'none';
                }
              }
            }

            return (
              <button
                key={action}
                onClick={() => { if (canAct) { if (action === 'fold') onFold(); else if (action === 'call') onCall(); else onRaise(); } }}
                disabled={!canAct}
                className="flex-1 py-3 rounded-xl text-sm font-black tracking-widest transition-all duration-200 select-none"
                style={{
                  backgroundColor: bg,
                  color: txt,
                  border,
                  transform: canAct ? 'scale(1)' : 'scale(0.97)',
                }}
              >
                {ACTION_LABELS[action]}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className="rounded-2xl p-4 space-y-2" style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--card-border)',
          animation: 'slideUp 0.2s ease-out',
        }}>
          {correct ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm font-bold" style={{ color: '#22c55e' }}>Верно!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <span className="text-sm font-bold" style={{ color: '#ef4444' }}>
                Неверно. Правильно: {ACTION_LABELS[recommendation.action]}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Pot Odds</div>
              <div className="text-base font-black" style={{ color: 'var(--text)' }}>{recommendation.potOddsPercent}%</div>
              <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{recommendation.potOddsRatio}</div>
            </div>
            <div className="rounded-xl p-2.5 text-center" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Equity</div>
              <div className={`text-base font-black ${recommendation.equity >= recommendation.potOddsPercent ? 'text-green-400' : 'text-red-400'}`}>
                {recommendation.equity}%
              </div>
            </div>
          </div>

          {recommendation.handName && (
            <div className="text-center">
              <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{recommendation.handName}</span>
              {recommendation.draws && recommendation.draws.length > 0 && (
                <span className="text-[10px] ml-1.5" style={{ color: 'var(--text-muted)' }}>({recommendation.draws.join(', ')})</span>
              )}
            </div>
          )}

          <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--surface)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{recommendation.explanation}</p>
          </div>

          <button
            onClick={onNext}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Следующая раздача
          </button>
        </div>
      )}
    </div>
  );
}
