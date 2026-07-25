import { FocusMode, MatchMode } from '@/features/GameSession/types';

export function getFocusModeDescription(mode: FocusMode) {
  return mode === FocusMode.Timed ? 'Two-minute challenge' : 'No clock, just practice';
}

export function getMatchModeDescription(mode: MatchMode) {
  return mode === MatchMode.Easy ? 'Replace matches in place' : 'Shuffle after every match';
}
