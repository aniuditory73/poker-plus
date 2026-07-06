import { Card, Rank, HandRank, Street } from './types';
import { getBestHand } from './evaluator';
import { rankToString } from './deck';

function uniqueSorted(ranks: number[]): number[] {
  const result: number[] = [];
  for (const r of ranks) {
    if (!result.includes(r)) result.push(r);
  }
  return result.sort((a, b) => b - a);
}

function hasStraight(ranks: number[]): boolean {
  const unique = uniqueSorted(ranks);
  if (unique.length < 5) return false;
  for (let i = 0; i <= unique.length - 5; i++) {
    if (unique[i] - unique[i + 4] === 4) return true;
  }
  const aceIdx = unique.indexOf(14);
  if (aceIdx === -1) return false;
  const withLowAce = unique.filter(r => r !== 14).concat([1]).sort((a, b) => b - a);
  for (let i = 0; i <= withLowAce.length - 5; i++) {
    if (withLowAce[i] - withLowAce[i + 4] === 4) return true;
  }
  return false;
}

export function countFlushOuts(holeCards: Card[], boardCards: Card[]): number {
  const allCards = [...holeCards, ...boardCards];
  const suitCount: Record<string, number> = {};
  for (const c of allCards) {
    suitCount[c.suit] = (suitCount[c.suit] || 0) + 1;
  }
  for (const [, count] of Object.entries(suitCount)) {
    if (count === 4) return 9;
  }
  return 0;
}

export function countStraightOuts(holeCards: Card[], boardCards: Card[]): { openEnded: number; gutshot: number } {
  const allCards = [...holeCards, ...boardCards];
  const ranks = allCards.map(c => c.rank);
  const unique = uniqueSorted(ranks);

  let openEnded = 0;
  let gutshot = 0;

  for (let r = 2; r <= 14; r++) {
    if (unique.includes(r)) continue;
    if (hasStraight([...unique, r])) {
      let isOpen = false;

      const sorted = [...unique, r].sort((a, b) => a - b);
      if (sorted[sorted.length - 1] - sorted[0] < 5) isOpen = true;

      const aceIdx = sorted.indexOf(14);
      if (aceIdx >= 0) {
        const shifted = sorted.filter(x => x !== 14).concat([1]).sort((a, b) => a - b);
        if (shifted[shifted.length - 1] - shifted[0] < 5) isOpen = true;
      }

      const straightCards: number[] = [];
      for (let i = 0; i <= sorted.length - 5; i++) {
        if (sorted[i + 4] - sorted[i] === 4) {
          for (let j = 0; j < 5; j++) {
            if (!straightCards.includes(sorted[i + j])) straightCards.push(sorted[i + j]);
          }
        }
      }
      const s = unique.filter(x => x !== 14).concat([1]).sort((a, b) => a - b);
      for (let i = 0; i <= s.length - 5; i++) {
        if (s[i + 4] - s[i] === 4) {
          for (let j = 0; j < 5; j++) {
            const val = s[i + j] === 1 ? 14 : s[i + j];
            if (!straightCards.includes(val)) straightCards.push(val);
          }
        }
      }

      const inStraight = straightCards.filter(x => unique.includes(x) || x === r);
      if (inStraight.length >= 5) {
        const minR = Math.min(...inStraight);
        const maxR = Math.max(...inStraight);
        const endCaps = [minR - 1, maxR + 1].filter(x => x >= 2 && x <= 14);
        if (endCaps.length === 2) isOpen = true;
      }

      if (isOpen) openEnded++;
      else gutshot++;
    }
  }

  return { openEnded: openEnded * 4, gutshot: gutshot * 4 };
}

export function countTotalOuts(holeCards: Card[], boardCards: Card[]): number {
  const flushOuts = countFlushOuts(holeCards, boardCards);
  const straightInfo = countStraightOuts(holeCards, boardCards);
  const totalStraight = straightInfo.openEnded + straightInfo.gutshot;
  let overlap = 0;
  if (flushOuts > 0 && totalStraight > 0) {
    const allCards = [...holeCards, ...boardCards];
    const flushSuit = allCards.find(c => {
      const cnt = allCards.filter(x => x.suit === c.suit).length;
      return cnt >= 4;
    })?.suit;
    if (flushSuit) {
      const flushRanks = allCards.filter(c => c.suit === flushSuit).map(c => c.rank);
      const allRanks = allCards.map(c => c.rank);
      const unique = uniqueSorted(allRanks);
      for (let r = 2; r <= 14; r++) {
        if (unique.includes(r) || !flushRanks.includes(r)) continue;
        if (hasStraight([...unique, r])) overlap += 1;
      }
    }
  }
  return flushOuts + totalStraight - overlap;
}

export function getImprovementPercent(outs: number, street: Street): number {
  if (outs <= 0) return 0;
  if (street === Street.Flop) return Math.min(outs * 4, 99);
  if (street === Street.Turn) return Math.min(outs * 2, 99);
  return 0;
}

export function getDrawDescriptions(holeCards: Card[], boardCards: Card[]): string[] {
  if (boardCards.length < 3) return [];

  const draws: string[] = [];
  const flushOuts = countFlushOuts(holeCards, boardCards);
  if (flushOuts > 0) draws.push('Флеш-дро');

  const straightInfo = countStraightOuts(holeCards, boardCards);
  if (straightInfo.openEnded > 0) draws.push('Стрит-дро');
  else if (straightInfo.gutshot > 0) draws.push('Гатшот');

  return draws;
}

export function getHandName(holeCards: Card[], boardCards: Card[], street: Street): string {
  if (street === Street.Preflop) return 'Префлоп';

  const allCards = [...holeCards, ...boardCards];
  const best = getBestHand(allCards);
  const holeRanks = holeCards.map(c => c.rank);
  const boardRanks = boardCards.map(c => c.rank);
  const maxBoard = boardRanks.length > 0 ? Math.max(...boardRanks) : 0;

  switch (best.handRank) {
    case HandRank.HighCard: {
      const high = best.kickers[0];
      return `Старшая карта (${rankToString(high as Rank)} high)`;
    }

    case HandRank.Pair: {
      const pairRank = best.kickers[0];
      const holePair = holeRanks.filter(r => r === pairRank).length;
      if (holePair === 2 && boardRanks.length > 0 && !boardRanks.includes(pairRank)) {
        return pairRank > maxBoard ? `Оверпара (${rankToString(pairRank as Rank)})` : `Пара (${rankToString(pairRank as Rank)})`;
      }
      if (pairRank === maxBoard) return `Топ-пара (${rankToString(pairRank as Rank)})`;
      if (boardRanks.filter(r => r > pairRank).length <= 1) return `Средняя пара (${rankToString(pairRank as Rank)})`;
      return `Нижняя пара (${rankToString(pairRank as Rank)})`;
    }

    case HandRank.TwoPair:
      return 'Две пары';

    case HandRank.ThreeOfAKind: {
      const tripRank = best.kickers[0];
      const holeCount = holeRanks.filter(r => r === tripRank).length;
      return holeCount >= 2 ? `Сет (${rankToString(tripRank as Rank)})` : `Трипс (${rankToString(tripRank as Rank)})`;
    }

    case HandRank.Straight:
      return 'Стрит';
    case HandRank.Flush:
      return 'Флеш';
    case HandRank.FullHouse:
      return 'Фулл-хаус';
    case HandRank.FourOfAKind:
      return 'Каре';
    case HandRank.StraightFlush:
      return 'Стрит-флеш';
    case HandRank.RoyalFlush:
      return 'Роял-флеш';
    default:
      return '';
  }
}
