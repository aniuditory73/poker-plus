export function getPositions(playerCount: number): string[] {
  if (playerCount < 2) return ['BTN', 'BB'];

  const ALL_POSITIONS = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'MP+1', 'MP+2', 'CO', 'BTN', 'SB', 'BB'];

  if (playerCount >= 10) return ALL_POSITIONS;

  const shortMap: Record<number, string[]> = {
    2: ['BTN', 'BB'],
    3: ['BTN', 'SB', 'BB'],
    4: ['UTG', 'BTN', 'SB', 'BB'],
    5: ['UTG', 'CO', 'BTN', 'SB', 'BB'],
    6: ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'],
    7: ['UTG', 'MP', 'MP+1', 'CO', 'BTN', 'SB', 'BB'],
    8: ['UTG', 'UTG+1', 'MP', 'CO', 'BTN', 'SB', 'BB'],
    9: ['UTG', 'UTG+1', 'MP', 'MP+1', 'CO', 'BTN', 'SB', 'BB'],
  };

  return shortMap[playerCount] || ALL_POSITIONS;
}

export function isEarlyPosition(position: string, playerCount: number): boolean {
  const pos = getPositions(playerCount);
  const idx = pos.indexOf(position);
  if (playerCount <= 3) return false;
  if (playerCount <= 5) return idx === 0;
  return idx < Math.ceil(pos.length / 3);
}

export function isLatePosition(position: string, playerCount: number): boolean {
  const pos = getPositions(playerCount);
  const idx = pos.indexOf(position);
  if (playerCount <= 3) return true;
  const lateStart = Math.ceil(pos.length * 2 / 3);
  return idx >= lateStart;
}
