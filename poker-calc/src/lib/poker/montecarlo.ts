import { Card, Street } from './types';
import { createDeck, shuffleArray } from './deck';
import { getBestHand, compareHands } from './evaluator';

export function getIterations(street: Street): number {
  switch (street) {
    case Street.Preflop: return 8000;
    case Street.Flop: return 5000;
    case Street.Turn: return 3000;
    case Street.River: return 6000;
  }
}

export function simulateMonteCarlo(
  holeCards: Card[],
  boardCards: Card[],
  numOpponents: number,
  street: Street
): { wins: number; ties: number; equity: number } {
  const deck = createDeck();
  const usedCards = [...holeCards, ...boardCards];
  const remaining = deck.filter(
    c => !usedCards.some(uc => uc.suit === c.suit && uc.rank === c.rank)
  );

  const numBoardToDeal = 5 - boardCards.length;
  const iterations = getIterations(street);

  let wins = 0;
  let ties = 0;

  for (let i = 0; i < iterations; i++) {
    const shuffled = shuffleArray(remaining);
    let idx = 0;

    const fullBoard = [...boardCards];
    for (let b = 0; b < numBoardToDeal; b++) {
      fullBoard.push(shuffled[idx++]);
    }

    const ourHand = getBestHand([...holeCards, ...fullBoard]);

    let beatAll = true;
    let tied = false;
    let tiedCount = 1;

    for (let o = 0; o < numOpponents; o++) {
      const oppHole = [shuffled[idx++], shuffled[idx++]];
      const oppHand = getBestHand([...oppHole, ...fullBoard]);
      const cmp = compareHands(ourHand, oppHand);
      if (cmp < 0) {
        beatAll = false;
        break;
      }
      if (cmp === 0) {
        tied = true;
        tiedCount++;
      }
    }

    if (beatAll) {
      if (tied) ties += 1 / tiedCount;
      else wins++;
    }
  }

  const equity = ((wins + ties) / iterations) * 100;
  return { wins, ties, equity };
}
