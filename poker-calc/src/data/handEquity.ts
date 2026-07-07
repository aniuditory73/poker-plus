import { Rank } from '@/lib/poker';

export const RANKS: Rank[] = [
  Rank.Ace, Rank.King, Rank.Queen, Rank.Jack, Rank.Ten,
  Rank.Nine, Rank.Eight, Rank.Seven, Rank.Six, Rank.Five,
  Rank.Four, Rank.Three, Rank.Two,
];

export const RANK_LABELS: Record<number, string> = {
  [Rank.Ace]: 'A',
  [Rank.King]: 'K',
  [Rank.Queen]: 'Q',
  [Rank.Jack]: 'J',
  [Rank.Ten]: 'T',
  [Rank.Nine]: '9',
  [Rank.Eight]: '8',
  [Rank.Seven]: '7',
  [Rank.Six]: '6',
  [Rank.Five]: '5',
  [Rank.Four]: '4',
  [Rank.Three]: '3',
  [Rank.Two]: '2',
};

function calcEquity(hi: number, lo: number, suited: boolean): number {
  if (hi === lo) return +(53.6 + (hi - 2) * 2.63).toFixed(1);
  const gap = hi - lo;
  const base = 32 + Math.max(0, hi - 5) * 3.5 + Math.max(0, lo - 7) * 0.7;
  const gapPenalty = gap * (0.4 + (hi >= 12 ? 0.2 : 0));
  const suitBonus = suited ? 3 + (gap <= 2 ? 0.5 : 0) : 0;
  return +(Math.min(86, Math.max(28, base - gapPenalty + suitBonus))).toFixed(1);
}

export function buildEquityMatrix(): number[][] {
  const n = RANKS.length;
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const r1 = RANKS[i];
      const r2 = RANKS[j];
      if (i === j) {
        row.push(calcEquity(r1, r2, false));
      } else if (i < j) {
        const hi = Math.max(r1, r2);
        const lo = Math.min(r1, r2);
        row.push(calcEquity(hi, lo, true));
      } else {
        const hi = Math.max(r1, r2);
        const lo = Math.min(r1, r2);
        row.push(calcEquity(hi, lo, false));
      }
    }
    matrix.push(row);
  }
  return matrix;
}

export function cellLabel(i: number, j: number): string {
  const hi = Math.max(RANKS[i], RANKS[j]);
  const lo = Math.min(RANKS[i], RANKS[j]);
  const hiL = RANK_LABELS[hi];
  const loL = RANK_LABELS[lo];
  if (i === j) return hiL + loL;
  return i < j ? hiL + loL + 's' : hiL + loL + 'o';
}

export function getHandRanks(i: number, j: number): { rank1: Rank; rank2: Rank; suited: boolean } {
  const r1 = RANKS[i];
  const r2 = RANKS[j];
  const hi = Math.max(r1, r2);
  const lo = Math.min(r1, r2);
  return { rank1: hi, rank2: lo, suited: i < j };
}

export const EQUITY_MATRIX = buildEquityMatrix();

export function equityColor(eq: number): string {
  if (eq >= 62) return '#22c55e';
  if (eq >= 42) return '#eab308';
  return '#ef4444';
}
