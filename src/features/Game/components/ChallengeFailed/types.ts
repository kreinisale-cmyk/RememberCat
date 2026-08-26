import { TimedRoundPhase } from '../../types';

export type ChallengeFailedProps = {
  phase: TimedRoundPhase;
  completedMatchCount: number;
  targetMatchCount: number;
  onRetry: () => void;
  onClose: () => void;
};
