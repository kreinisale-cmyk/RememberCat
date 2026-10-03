import { MatchMode } from '@/features/GameSession/types';

export function isHappyCat(matchMode: MatchMode) {
  return matchMode === MatchMode.Easy;
}
