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
        <label className="block text-xs text-gray-400 mb-2 font-medium">Ваша рука</label>
        <div className="flex justify-center gap-8">
          <CardSelector
            label="Карта 1"
            value={card1}
            onChange={c => setCard1(c)}
            exclude={card2 ? [card2, ...boardCards()] : boardCards()}
          />
          <CardSelector
            label="Карта 2"
            value={card2}
            onChange={c => setCard2(c)}
            exclude={card1 ? [card1, ...boardCards()] : boardCards()}
          />
        </div>
      </div>

      <PositionSelector
        playerCount={playersCount}
        selected={position}
        onSelect={setPosition}
      />

      <div>
        <label className="block text-xs text-gray-400 mb-2 font-medium">Стадия</label>
        <div className="bg-[#0f1923]/60 rounded-xl p-1 flex gap-1">
          {([
            [Street.Preflop, 'PF'],
            [Street.Flop, 'FL'],
            [Street.Turn, 'TU'],
            [Street.River, 'RI'],
          ] as const).map(([s, label]) => (
            <button
              key={s}
              onClick={() => setStreet(s)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                street === s
                  ? 'bg-[#2d9cdb] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {street !== Street.Preflop && (
        <div>
          <label className="block text-xs text-gray-400 mb-2 font-medium">Борд</label>
          <div className="flex justify-center gap-2">
            {Array.from({ length: boardCount }).map((_, i) => {
              const setters = [setBoard1, setBoard2, setBoard3, setBoard4, setBoard5];
              const vals = [board1, board2, board3, board4, board5];
              return (
                <CardSelector
                  key={i}
                  label={`B${i + 1}`}
                  value={vals[i]}
                  onChange={c => setters[i](c)}
                  exclude={[...[card1, card2].filter(Boolean) as Card[], ...vals.filter((v, j) => j !== i && v !== null) as Card[]]}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">Банк ($)</label>
          <input
            type="number"
            value={potSize}
            onChange={e => setPotSize(e.target.value)}
            placeholder="120"
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">Ставка к коллу ($)</label>
          <input
            type="number"
            value={betToCall}
            onChange={e => setBetToCall(e.target.value)}
            placeholder="50"
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          />
          <div className="flex gap-1 mt-1.5">
            {[
              [0.33, '⅓'],
              [0.5, '½'],
              [0.66, '⅔'],
              [1, 'Pot'],
            ].map(([f, label]) => (
              <button
                key={label}
                onClick={() => setBetFraction(f as number)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-[#0f1923]/60 text-gray-300 hover:bg-[#2a4a5a]/40 hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">Агрессия стола</label>
          <select
            value={aggression}
            onChange={e => setAggression(e.target.value as 'passive' | 'neutral' | 'aggressive')}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          >
            <option value="passive">Пассивная</option>
            <option value="neutral">Нейтральная</option>
            <option value="aggressive">Агрессивная</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5 font-medium">Действие оппонента</label>
          <select
            value={opponentAction}
            onChange={e => setOpponentAction(e.target.value as OpponentAction)}
            className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
          >
            {(['check', 'call', 'bet', 'raise', '3bet', 'allin'] as OpponentAction[]).map(a => (
              <option key={a} value={a}>{ACTION_LABELS[a]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Игроков в раздаче</label>
        <input
          type="number"
          min={2}
          max={playersCount}
          value={remainingPlayers}
          onChange={e => setRemainingPlayers(Math.min(playersCount, Math.max(2, Number(e.target.value))))}
          className="w-full bg-[#0f1923]/80 text-white rounded-xl px-3 py-2.5 text-sm border border-[#2a4a5a]/30 focus:border-[#2d9cdb] outline-none transition-colors"
        />
      </div>

      <button
        onClick={handleCalculate}
        disabled={!card1 || !card2 || !position || calculating}
        className={`w-full py-3 rounded-xl text-base font-bold transition-all shadow-lg ${
          !card1 || !card2 || !position || calculating
            ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#2d9cdb] to-[#1b6d9b] hover:from-[#268cc7] hover:to-[#155d8a] text-white shadow-[#2d9cdb]/20'
        }`}
      >
        {calculating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Расчёт...
          </span>
        ) : (
          'Рассчитать'
        )}
      </button>
    </div>
  );
}
