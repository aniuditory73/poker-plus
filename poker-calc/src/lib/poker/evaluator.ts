import { Card, HandRank, EvaluatedHand } from './types';

function getCombinations(arr: Card[], k: number): Card[][] {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const result: Card[][] = [];
  const first = arr[0];
  const rest = arr.slice(1);
  for (const combo of getCombinations(rest, k - 1)) {
    result.push([first, ...combo]);
  }
  for (const combo of getCombinations(rest, k)) {
    result.push(combo);
  }
  return result;
}

function uniqueRanks(ranks: number[]): number[] {
  const set: number[] = [];
  for (const r of ranks) {
    if (!set.includes(r)) set.push(r);
  }
  return set.sort((a, b) => b - a);
}

function checkStraight(ranks: number[]): boolean {
  const unique = uniqueRanks(ranks);
  if (unique.length < 5) return false;
  if (unique[0] - unique[4] === 4) return true;
  if (unique[0] === 14 && unique[1] === 5 && unique[2] === 4 && unique[3] === 3 && unique[4] === 2) return true;
  return false;
}

function getStraightHigh(ranks: number[]): number {
  const unique = uniqueRanks(ranks);
  if (unique[0] - unique[4] === 4) return unique[0];
  if (unique[0] === 14 && unique[1] === 5 && unique[2] === 4 && unique[3] === 3 && unique[4] === 2) return 5;
  return unique[0];
}

function evaluate5Cards(cards: Card[]): EvaluatedHand {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map(c => c.rank);
  const suits = sorted.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = checkStraight(ranks);
  const straightHigh = isStraight ? getStraightHigh(ranks) : 0;

  const freq = new Map<number, number>();
  for (const r of ranks) {
    freq.set(r, (freq.get(r) || 0) + 1);
  }
  const groups = Array.from(freq.entries()).sort((a, b) => {
    if (a[1] !== b[1]) return b[1] - a[1];
    return b[0] - a[0];
  });

  if (isFlush && isStraight) {
    if (straightHigh === 14) {
      return { handRank: HandRank.RoyalFlush, kickers: [14] };
    }
    return { handRank: HandRank.StraightFlush, kickers: [straightHigh] };
  }

  if (groups[0][1] === 4) {
    const quadRank = groups[0][0];
    const kicker = groups[1][0];
    return { handRank: HandRank.FourOfAKind, kickers: [quadRank, kicker] };
  }

  if (groups[0][1] === 3 && groups.length > 1 && groups[1][1] === 2) {
    return { handRank: HandRank.FullHouse, kickers: [groups[0][0], groups[1][0]] };
  }

  if (isFlush) {
    return { handRank: HandRank.Flush, kickers: ranks };
  }

  if (isStraight) {
    return { handRank: HandRank.Straight, kickers: [straightHigh] };
  }

  if (groups[0][1] === 3) {
    const tripRank = groups[0][0];
    const kickers = groups.slice(1).map(g => g[0]);
    return { handRank: HandRank.ThreeOfAKind, kickers: [tripRank, ...kickers] };
  }

  if (groups[0][1] === 2 && groups.length > 1 && groups[1][1] === 2) {
    const highPair = Math.max(groups[0][0], groups[1][0]);
    const lowPair = Math.min(groups[0][0], groups[1][0]);
    const kicker = groups[2][0];
    return { handRank: HandRank.TwoPair, kickers: [highPair, lowPair, kicker] };
  }

  if (groups[0][1] === 2) {
    const pairRank = groups[0][0];
    const kickers = groups.slice(1).map(g => g[0]);
    return { handRank: HandRank.Pair, kickers: [pairRank, ...kickers] };
  }

  return { handRank: HandRank.HighCard, kickers: ranks };
}

export function getBestHand(cards: Card[]): EvaluatedHand {
  if (cards.length < 5) throw new Error('Need at least 5 cards to evaluate');
  if (cards.length === 5) return evaluate5Cards(cards);

  const combos = getCombinations(cards, 5);
  let best: EvaluatedHand | null = null;

  for (const combo of combos) {
    const hand = evaluate5Cards(combo);
    if (!best || compareHands(hand, best) > 0) {
      best = hand;
    }
  }

  return best!;
}

export function compareHands(a: EvaluatedHand, b: EvaluatedHand): number {
  if (a.handRank !== b.handRank) {
    return a.handRank - b.handRank;
  }
  for (let i = 0; i < Math.min(a.kickers.length, b.kickers.length); i++) {
    if (a.kickers[i] !== b.kickers[i]) {
      return a.kickers[i] - b.kickers[i];
    }
  }
  return 0;
}

export function handRankToString(handRank: HandRank): string {
  const names: Record<HandRank, string> = {
    [HandRank.HighCard]: 'High Card',
    [HandRank.Pair]: 'Pair',
    [HandRank.TwoPair]: 'Two Pair',
    [HandRank.ThreeOfAKind]: 'Three of a Kind',
    [HandRank.Straight]: 'Straight',
    [HandRank.Flush]: 'Flush',
    [HandRank.FullHouse]: 'Full House',
    [HandRank.FourOfAKind]: 'Four of a Kind',
    [HandRank.StraightFlush]: 'Straight Flush',
    [HandRank.RoyalFlush]: 'Royal Flush',
  };
  return names[handRank];
}

export function handRankValue(handRank: HandRank): number {
  return handRank;
}
