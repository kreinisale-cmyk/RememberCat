import { MatchMode } from '@/features/GameSession/types';

export function getNextMatchMode(matchMode: MatchMode) {
  return matchMode === MatchMode.Easy ? MatchMode.Hard : MatchMode.Easy;
}

export function createMatchModeAccessibilityLabel(matchMode: MatchMode) {
  const nextMatchMode = getNextMatchMode(matchMode);

  return `Difficulty: ${matchMode}. Toggle to ${nextMatchMode}.`;
}
