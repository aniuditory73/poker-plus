import { Card, Suit, Rank } from './types';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of Object.values(Suit)) {
    for (const rank of Object.values(Rank).filter(v => typeof v === 'number')) {
      deck.push({ suit: suit as Suit, rank: rank as Rank });
    }
  }
  return deck;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function cardToString(card: Card): string {
  const rankStr = card.rank >= 2 && card.rank <= 10 ? String(card.rank) :
    card.rank === Rank.Jack ? 'J' :
    card.rank === Rank.Queen ? 'Q' :
    card.rank === Rank.King ? 'K' : 'A';
  const suitSymbol = card.suit === Suit.Hearts ? '♥' :
    card.suit === Suit.Diamonds ? '♦' :
    card.suit === Suit.Clubs ? '♣' : '♠';
  return `${rankStr}${suitSymbol}`;
}

export function rankToString(rank: Rank): string {
  if (rank >= 2 && rank <= 10) return String(rank);
  if (rank === Rank.Jack) return 'J';
  if (rank === Rank.Queen) return 'Q';
  if (rank === Rank.King) return 'K';
  return 'A';
}

export function suitToSymbol(suit: Suit): string {
  switch (suit) {
    case Suit.Hearts: return '♥';
    case Suit.Diamonds: return '♦';
    case Suit.Clubs: return '♣';
    case Suit.Spades: return '♠';
  }
}

export function suitColor(suit: Suit): string {
  if (suit === Suit.Hearts || suit === Suit.Diamonds) return 'text-red-500';
  return 'text-black';
}
