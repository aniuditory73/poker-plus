'use client';

import { useState } from 'react';
import {
  Card,
  Street,
  HandParams,
  OpponentAction,
} from '@/lib/poker';
import CardSelector from './CardSelector';
import PositionSelector from './PositionSelector';
import { PresetInfo } from './HandPresets';
import PresetSuitPicker from './PresetSuitPicker';
import RangeGrid from './RangeGrid';

interface Props {
  playersCount: number;
  onCalculate: (params: HandParams) => void;
  calculating: boolean;
}

const ACTION_LABELS: Record<OpponentAction, string> = {
  check: 'Чек',
  call: 'Колл',
  bet: 'Ставка',
  raise: 'Рейз',
  '3bet': '3-бет',
  allin: 'All-in',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--bg-input)',
  color: 'var(--text)',
  borderRadius: '12px',
  padding: '10px 12px',
  fontSize: '14px',
  border: '1px solid var(--border)',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function GameForm({ playersCount, onCalculate, calculating }: Props) {
  const [card1, setCard1] = useState<Card | null>(null);
  const [card2, setCard2] = useState<Card | null>(null);
  const [position, setPosition] = useState<string>('');
  const [street, setStreet] = useState<Street>(Street.Preflop);
  const [board1, setBoard1] = useState<Card | null>(null);
  const [board2, setBoard2] = useState<Card | null>(null);
  const [board3, setBoard3] = useState<Card | null>(null);
  const [board4, setBoard4] = useState<Card | null>(null);
  const [board5, setBoard5] = useState<Card | null>(null);
  const [potSize, setPotSize] = useState('');
  const [betToCall, setBetToCall] = useState('');
  const [remainingPlayers, setRemainingPlayers] = useState(playersCount);
  const [aggression, setAggression] = useState<'passive' | 'neutral' | 'aggressive'>('neutral');
  const [opponentAction, setOpponentAction] = useState<OpponentAction>('bet');
  const [showRange, setShowRange] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<PresetInfo | null>(null);

  const boardCards = (): Card[] => {
    const cards = [board1, board2, board3, board4, board5].filter(Boolean) as Card[];
    if (street === Street.Preflop) return [];
    if (street === Street.Flop) return cards.slice(0, 3);
    if (street === Street.Turn) return cards.slice(0, 4);
    return cards.slice(0, 5);
  };

  const boardCount = street === Street.Preflop ? 0 : street === Street.Flop ? 3 : street === Street.Turn ? 4 : 5;

  const handleCalculate = () => {
    if (!card1 || !card2 || !position) return;
    const holes = [card1, card2] as [Card, Card];
    onCalculate({
      holeCards: holes,
      position,
      street,
      boardCards: boardCards(),
      potSize: Number(potSize) || 0,
      betToCall: Number(betToCall) || 0,
      remainingPlayers: remainingPlayers,
      opponentAggression: aggression,
      opponentAction,
    });
  };

  const setBetFraction = (fraction: number) => {
    const pot = Number(potSize) || 0;
    setBetToCall(String(Math.round(pot * fraction)));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Ваша рука</label>
        <div className="flex justify-center gap-8">
          <CardSelector label="Карта 1" value={card1} onChange={c => setCard1(c)} exclude={card2 ? [card2, ...boardCards()] : boardCards()} />
          <CardSelector label="Карта 2" value={card2} onChange={c => setCard2(c)} exclude={card1 ? [card1, ...boardCards()] : boardCards()} />
        </div>
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setShowRange(!showRange)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              backgroundColor: showRange ? 'var(--accent)' : 'var(--surface)',
              color: showRange ? 'white' : 'var(--text-secondary)',
            }}
          >
            Range
          </button>
        </div>
        {showRange && !pendingPreset && (
          <RangeGrid
            onSelect={preset => setPendingPreset(preset)}
            onClose={() => setShowRange(false)}
          />
        )}
        {pendingPreset && (
          <PresetSuitPicker
            preset={pendingPreset}
            onConfirm={(c1, c2) => { setCard1(c1); setCard2(c2); setPendingPreset(null); setShowRange(false); }}
            onCancel={() => setPendingPreset(null)}
          />
        )}
      </div>

      <PositionSelector playerCount={playersCount} selected={position} onSelect={setPosition} />

      <div>
        <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Стадия</label>
        <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: 'var(--surface)' }}>
          {([
            [Street.Preflop, 'PF'],
            [Street.Flop, 'FL'],
            [Street.Turn, 'TU'],
            [Street.River, 'RI'],
          ] as const).map(([s, label]) => (
            <button
              key={s}
              onClick={() => setStreet(s)}
              className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                backgroundColor: street === s ? 'var(--accent)' : 'transparent',
                color: street === s ? 'white' : 'var(--text-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {street !== Street.Preflop && (
        <div>
          <label className="block text-xs mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Борд</label>
          <div className="flex justify-center gap-2">
            {Array.from({ length: boardCount }).map((_, i) => {
              const setters = [setBoard1, setBoard2, setBoard3, setBoard4, setBoard5];
              const vals = [board1, board2, board3, board4, board5];
              return (
                <CardSelector key={i} label={`B${i + 1}`} value={vals[i]} onChange={c => setters[i](c)}
                  exclude={[...[card1, card2].filter(Boolean) as Card[], ...vals.filter((v, j) => j !== i && v !== null) as Card[]]} />
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Банк ($)</label>
          <input type="number" value={potSize} onChange={e => setPotSize(e.target.value)} placeholder="120" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Ставка к коллу ($)</label>
          <input type="number" value={betToCall} onChange={e => setBetToCall(e.target.value)} placeholder="50" style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          <div className="flex gap-1 mt-1.5">
            {[[0.33, '⅓'], [0.5, '½'], [0.66, '⅔'], [1, 'Pot']].map(([f, label]) => (
              <button key={label} onClick={() => setBetFraction(f as number)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
                style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Агрессия стола</label>
          <select value={aggression} onChange={e => setAggression(e.target.value as 'passive' | 'neutral' | 'aggressive')} style={inputStyle}>
            <option value="passive">Пассивная</option>
            <option value="neutral">Нейтральная</option>
            <option value="aggressive">Агрессивная</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Действие оппонента</label>
          <select value={opponentAction} onChange={e => setOpponentAction(e.target.value as OpponentAction)} style={inputStyle}>
            {(['check', 'call', 'bet', 'raise', '3bet', 'allin'] as OpponentAction[]).map(a => (
              <option key={a} value={a}>{ACTION_LABELS[a]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Игроков в раздаче</label>
        <input type="number" min={2} max={playersCount} value={remainingPlayers}
          onChange={e => setRemainingPlayers(Math.min(playersCount, Math.max(2, Number(e.target.value))))} style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
      </div>

      <button
        onClick={handleCalculate}
        disabled={!card1 || !card2 || !position || calculating}
        className="w-full py-3 rounded-xl text-base font-bold transition-all shadow-lg"
        style={{
          background: !card1 || !card2 || !position || calculating
            ? 'rgba(100, 100, 100, 0.5)'
            : 'linear-gradient(135deg, var(--accent), #1b6d9b)',
          color: !card1 || !card2 || !position || calculating ? 'var(--text-muted)' : 'white',
          cursor: !card1 || !card2 || !position || calculating ? 'not-allowed' : 'pointer',
          boxShadow: !card1 || !card2 || !position || calculating ? 'none' : '0 4px 15px var(--accent-glow)',
        }}
      >
        {calculating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Расчёт...
          </span>
        ) : 'Рассчитать'}
      </button>
    </div>
  );
}
