import { MatchMode } from '@/features/GameSession/types';

export function getMatchModeDescription(mode: MatchMode) {
  return mode === MatchMode.Easy
    ? 'Practice every word five times, then shuffle translations only'
    : 'Skip easy practice and shuffle both columns after every match';
}
