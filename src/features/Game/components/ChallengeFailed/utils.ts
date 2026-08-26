import { TimedRoundPhase } from '../../types';

export function createFailureStageLabel(phase: TimedRoundPhase) {
  return `Stage ${phase} of 3`;
}

export function createFailureScoreLabel(completedMatchCount: number, targetMatchCount: number) {
  return `${completedMatchCount} of ${targetMatchCount} matches completed`;
}
