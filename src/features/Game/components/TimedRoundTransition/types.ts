import { TimedRoundPhase } from '../../types';

export type TimedRoundTransitionProps = {
  targetPhase: TimedRoundPhase;
  onContinue: () => void;
};
