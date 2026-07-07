import { Card, Street, OpponentAction, Recommendation, HandParams } from './types';
import { createDeck, shuffleArray } from './deck';
import { getPositions } from './positions';
import { calculateEquity, calculatePotOdds, calculateSPR, getRecommendation } from './calculator';

export interface TrainerScenario {
  params: HandParams;
  correctAction: 'fold' | 'call' | 'raise';
  recommendation: Recommendation;
  setup: { buyIn: number; currentStack: number; bigBlind: number };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const OPPONENT_ACTIONS: OpponentAction[] = ['bet', 'bet', 'raise', '3bet', 'allin'];
const AGGRESSIONS: ('passive' | 'neutral' | 'aggressive')[] = ['passive', 'neutral', 'neutral', 'aggressive'];
const STREETS = [Street.Preflop, Street.Preflop, Street.Flop, Street.Flop, Street.Turn, Street.River];
const PLAYER_COUNTS = [6, 9];

export function generateScenario(): TrainerScenario {
  const buyIn = pick([500, 1000, 2000, 5000]);
  const playersCount = pick(PLAYER_COUNTS);
  const bigBlind = pick([5, 10, 20, 50, 100]);
  const currentStack = pick([50, 60, 80, 100, 120, 150, 200]) * bigBlind;

  const deck = createDeck();
  const shuffled = shuffleArray(deck);
  const holeCards: [Card, Card] = [shuffled[0], shuffled[1]];

  const street = pick(STREETS);
  let boardCards: Card[] = [];
  switch (street) {
    case Street.Flop:
      boardCards = shuffled.slice(2, 5);
      break;
    case Street.Turn:
      boardCards = shuffled.slice(2, 6);
      break;
    case Street.River:
      boardCards = shuffled.slice(2, 7);
      break;
  }

  const positions = getPositions(playersCount);
  const position = pick(positions);

  const potRatio = pick([0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1.0, 1.25, 1.5]);
  const potSize = Math.max(bigBlind * 3, Math.round(currentStack * potRatio));

  const betToPotRatio = pick([0.25, 0.33, 0.5, 0.5, 0.67, 0.75, 1.0]);
  const betToCall = Math.min(
    Math.round(potSize * betToPotRatio),
    currentStack,
  );

  const remainingPlayers = randInt(2, 4);
  const opponentAggression = pick(AGGRESSIONS);
  const opponentAction = pick(OPPONENT_ACTIONS);

  const params: HandParams = {
    holeCards,
    position,
    street,
    boardCards,
    potSize,
    betToCall,
    remainingPlayers,
    opponentAggression,
    opponentAction,
  };

  const numOpponents = remainingPlayers - 1;
  const equity = calculateEquity(holeCards, boardCards, street, numOpponents, opponentAction);
  const potOdds = calculatePotOdds(potSize, betToCall, currentStack);
  const spr = calculateSPR(potSize, currentStack);

  const recommendation = getRecommendation(
    equity, potOdds.percent, position, playersCount, spr,
    street, opponentAggression, currentStack, betToCall, potSize,
    holeCards, boardCards, opponentAction,
  );

  return {
    params,
    correctAction: recommendation.action,
    recommendation,
    setup: { buyIn, currentStack, bigBlind },
  };
}
