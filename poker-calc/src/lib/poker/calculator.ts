import { Card, Street, Recommendation, OpponentAction } from './types';
import { isEarlyPosition, isLatePosition } from './positions';
import { simulateMonteCarlo } from './montecarlo';
import { rankToString } from './deck';
import { getHandName, countTotalOuts, getImprovementPercent, getDrawDescriptions } from './handDescription';

const equityCache = new Map<string, number>();

export function normalizeHand(cards: [Card, Card]): string {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const [high, low] = sorted;
  if (high.rank === low.rank) {
    return rankToString(high.rank) + rankToString(low.rank);
  }
  const suited = high.suit === low.suit;
  return rankToString(high.rank) + rankToString(low.rank) + (suited ? 's' : 'o');
}

function cacheKey(holeCards: [Card, Card], numOpponents: number): string {
  return `${normalizeHand(holeCards)}_${numOpponents}`;
}

export function clearEquityCache(): void { equityCache.clear(); }
export function getCacheSize(): number { return equityCache.size; }

export function calculatePotOdds(potSize: number, betToCall: number, currentStack?: number): { percent: number; ratio: string } {
  if (betToCall <= 0) return { percent: 0, ratio: '∞ : 1' };
  const effectiveBet = currentStack !== undefined && betToCall > currentStack ? currentStack : betToCall;
  const totalPot = potSize + effectiveBet;
  const percent = (effectiveBet / totalPot) * 100;
  const oddsRatio = effectiveBet > 0 ? potSize / effectiveBet : Infinity;
  const ratioStr = oddsRatio === Infinity ? '∞ : 1' : `${oddsRatio.toFixed(1)} : 1`;
  return { percent: Math.round(percent * 10) / 10, ratio: ratioStr };
}

export function calculateSPR(potSize: number, stack: number): number {
  if (potSize <= 0) return 0;
  return stack / potSize;
}

function getPositionFactor(position: string, playerCount: number): number {
  if (isEarlyPosition(position, playerCount)) return 1.3;
  if (isLatePosition(position, playerCount)) return 0.85;
  return 1.0;
}

function getActionMultiplier(action: OpponentAction): number {
  switch (action) {
    case 'check': return 1.05;
    case 'call': return 1.0;
    case 'bet': return 0.95;
    case 'raise': return 0.88;
    case '3bet': return 0.80;
    case 'allin': return 0.75;
  }
}

function actionLabel(action: OpponentAction): string {
  switch (action) {
    case 'check': return 'чек';
    case 'call': return 'колл';
    case 'bet': return 'ставку';
    case 'raise': return 'рейз';
    case '3bet': return '3-бет';
    case 'allin': return 'all-in';
  }
}

function actionRangeNote(action: OpponentAction): string {
  switch (action) {
    case 'check': return 'Диапазон оппонента широк (чек)';
    case 'call': return 'Средний диапазон оппонента (колл)';
    case 'bet': return 'Диапазон сильнее случайного (ставка)';
    case 'raise': return 'Узкий сильный диапазон (рейз)';
    case '3bet': return 'Премиум диапазон (3-бет)';
    case 'allin': return 'Очень сильный/полярный диапазон (all-in)';
  }
}

export function calculateEquity(
  holeCards: [Card, Card],
  boardCards: Card[],
  street: Street,
  numOpponents: number,
  action?: OpponentAction
): number {
  const mult = action ? getActionMultiplier(action) : 1.0;
  if (street === Street.Preflop) {
    const key = cacheKey(holeCards, numOpponents);
    const cached = equityCache.get(key);
    if (cached !== undefined) return cached;
    const result = simulateMonteCarlo(holeCards, boardCards, numOpponents, street);
    const eq = Math.round(result.equity * mult * 10) / 10;
    equityCache.set(key, eq);
    return eq;
  }
  const result = simulateMonteCarlo(holeCards, boardCards, numOpponents, street);
  return Math.round(result.equity * mult * 10) / 10;
}

export function getRecommendation(
  equity: number,
  potOddsPercent: number,
  position: string,
  playerCount: number,
  spr: number,
  street: Street,
  _opponentAggression: 'passive' | 'neutral' | 'aggressive',
  currentStack: number,
  betToCall: number,
  potSize: number,
  holeCards?: [Card, Card],
  boardCards?: Card[],
  action?: OpponentAction,
): Recommendation {
  const posFactor = getPositionFactor(position, playerCount);
  const effectiveBet = betToCall > currentStack ? currentStack : betToCall;
  const effectivePotOdds = betToCall > 0 ? (effectiveBet / (potSize + effectiveBet)) * 100 : 0;
  const requiredEquity = effectivePotOdds > 0 ? effectivePotOdds * posFactor : 0;
  const potOddsRatio = effectivePotOdds > 0 ? `${((100 / effectivePotOdds) - 1).toFixed(1)} : 1` : '∞ : 1';

  const handName = holeCards && boardCards ? getHandName(holeCards, boardCards, street) : undefined;
  const totalOuts = holeCards && boardCards && (street === Street.Flop || street === Street.Turn)
    ? countTotalOuts(holeCards, boardCards) : undefined;
  const improvementPct = totalOuts ? getImprovementPercent(totalOuts, street) : undefined;
  const draws = holeCards && boardCards ? getDrawDescriptions(holeCards, boardCards) : undefined;
  const rangeNote = action ? actionRangeNote(action) : '';
  const rangeSuffix = rangeNote ? ` (${rangeNote})` : '';
  const actionSuffix = action ? ` Оппонент: ${actionLabel(action)}.` : '';

  const cantCall = betToCall > currentStack;

  if (cantCall) {
    const allInOdds = (currentStack / (potSize + currentStack)) * 100;
    if (equity >= allInOdds * 1.1) {
      return {
        action: 'raise', potOddsPercent: Math.round(allInOdds * 10) / 10,
        potOddsRatio, equity, raiseSize: 100, handName, outs: totalOuts,
        improvementPercent: improvementPct, draws,
        explanation: `Ставка $${betToCall} > стек $${currentStack}. All-in: equity ${equity}% > ${Math.round(allInOdds)}%.${actionSuffix}`,
        color: 'green',
      };
    }
    return {
      action: 'fold', potOddsPercent: Math.round(allInOdds * 10) / 10,
      potOddsRatio, equity, handName, outs: totalOuts,
      improvementPercent: improvementPct, draws,
      explanation: `Ставка $${betToCall} > стек $${currentStack}. Equity ${equity}% < ${Math.round(allInOdds)}% для all-in. Фолд.${actionSuffix}`,
      color: 'red',
    };
  }

  const stackCommitment = betToCall / currentStack;
  const equityOverRequired = equity / (requiredEquity > 0 ? requiredEquity : 1);

  if (stackCommitment > 0.5) {
    const allInOdds = (currentStack / (potSize + currentStack)) * 100;
    if (equity >= allInOdds * 1.15) {
      return {
        action: 'raise', potOddsPercent: Math.round(allInOdds * 10) / 10,
        potOddsRatio, equity, raiseSize: 100, handName, outs: totalOuts,
        improvementPercent: improvementPct, draws,
        explanation: `Ставка >50% стека. All-in: equity ${equity}% > ${Math.round(allInOdds)}%.${actionSuffix}`,
        color: 'green',
      };
    }
    if (equity >= allInOdds) {
      return {
        action: 'call', potOddsPercent: Math.round(allInOdds * 10) / 10,
        potOddsRatio, equity, handName, outs: totalOuts,
        improvementPercent: improvementPct, draws,
        explanation: `Ставка >50% стека. Пограничный колл.${actionSuffix}`,
        color: 'yellow',
      };
    }
    return {
      action: 'fold', potOddsPercent, potOddsRatio, equity,
      handName, outs: totalOuts, improvementPercent: improvementPct, draws,
      explanation: `Ставка >50% стека, equity ${equity}% ниже. Фолд.${actionSuffix}`,
      color: 'red',
    };
  }

  if (effectivePotOdds === 0) {
    if (equity >= 25) {
      return {
        action: 'raise', potOddsPercent, potOddsRatio, equity,
        raiseSize: spr > 10 ? 33 : 50, handName, outs: totalOuts,
        improvementPercent: improvementPct, draws,
        explanation: `Нет ставки. ${handName || ''} Equity ${equity}%. Рейз ${spr > 10 ? 33 : 50}% банка.${actionSuffix}${rangeSuffix}`,
        color: 'green',
      };
    }
    return {
      action: 'call', potOddsPercent, potOddsRatio, equity,
      handName, outs: totalOuts, improvementPercent: improvementPct, draws,
      explanation: `Нет ставки. ${handName || ''} Чек.${actionSuffix}${rangeSuffix}`,
      color: 'green',
    };
  }

  if (equityOverRequired >= 1.5) {
    const raiseSize = spr > 10 ? 33 : spr > 6 ? 50 : 75;
    return {
      action: 'raise', potOddsPercent: effectivePotOdds, potOddsRatio, equity,
      raiseSize, handName, outs: totalOuts, improvementPercent: improvementPct, draws,
      explanation: `${handName ? handName + '. ' : ''}Equity ${equity}% >> ${requiredEquity.toFixed(1)}%. Рейз ${raiseSize}% банка.${actionSuffix}${rangeSuffix}`,
      color: 'green',
    };
  }

  if (equityOverRequired >= 1.0) {
    return {
      action: 'call', potOddsPercent: effectivePotOdds, potOddsRatio, equity,
      handName, outs: totalOuts, improvementPercent: improvementPct, draws,
      explanation: `${handName ? handName + '. ' : ''}Equity ${equity}% ≥ ${requiredEquity.toFixed(1)}%. Колл.${actionSuffix}${rangeSuffix}`,
      color: 'green',
    };
  }

  if (equityOverRequired >= 0.85) {
    return {
      action: 'call', potOddsPercent: effectivePotOdds, potOddsRatio, equity,
      handName, outs: totalOuts, improvementPercent: improvementPct, draws,
      explanation: `${handName ? handName + '. ' : ''}Equity ${equity}% ≈ ${requiredEquity.toFixed(1)}%. Пограничный колл.${actionSuffix}${rangeSuffix}`,
      color: 'yellow',
    };
  }

  return {
    action: 'fold', potOddsPercent: effectivePotOdds, potOddsRatio, equity,
    handName, outs: totalOuts, improvementPercent: improvementPct, draws,
    explanation: `${handName ? handName + '. ' : ''}Equity ${equity}% < ${requiredEquity.toFixed(1)}%. Фолд.${actionSuffix}${rangeSuffix}`,
    color: 'red',
  };
}
