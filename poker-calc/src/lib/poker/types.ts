export enum Suit {
  Hearts = 'h',
  Diamonds = 'd',
  Clubs = 'c',
  Spades = 's',
}

export enum Rank {
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
  Jack = 11,
  Queen = 12,
  King = 13,
  Ace = 14,
}

export interface Card {
  suit: Suit;
  rank: Rank;
}

export enum HandRank {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  FourOfAKind = 7,
  StraightFlush = 8,
  RoyalFlush = 9,
}

export interface EvaluatedHand {
  handRank: HandRank;
  kickers: number[];
}

export enum Street {
  Preflop = 'preflop',
  Flop = 'flop',
  Turn = 'turn',
  River = 'river',
}

export interface GameSetup {
  buyIn: number;
  playersCount: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  currentStack: number;
}

export type OpponentAction = 'check' | 'call' | 'bet' | 'raise' | '3bet' | 'allin';

export interface HandParams {
  holeCards: [Card, Card] | null;
  position: string;
  street: Street;
  boardCards: Card[];
  potSize: number;
  betToCall: number;
  remainingPlayers: number;
  opponentAggression: 'passive' | 'neutral' | 'aggressive';
  opponentAction: OpponentAction;
}

export interface Recommendation {
  action: 'fold' | 'call' | 'raise';
  potOddsPercent: number;
  potOddsRatio: string;
  equity: number;
  explanation: string;
  raiseSize?: number;
  color: 'green' | 'red' | 'yellow';
  handName?: string;
  outs?: number;
  improvementPercent?: number;
  draws?: string[];
}

export interface HandHistory {
  id: string;
  timestamp: number;
  holeCards: [Card, Card] | null;
  position: string;
  street: Street;
  boardCards: Card[];
  potSize: number;
  betToCall: number;
  recommendation: Recommendation;
  stackChange?: number;
}
