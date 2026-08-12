import { getTimedRoundBoardSize } from '../../utils';
import {
  TRANSITION_KICKER_PREFIX,
  TRANSITION_TITLE_PREFIX,
  TRANSITION_TITLE_SUFFIX,
} from './constants';
import { TimedRoundPhase } from '../../types';

export function createTimedRoundTransitionTitle(targetPhase: TimedRoundPhase) {
  return `${TRANSITION_TITLE_PREFIX} ${getTimedRoundBoardSize(targetPhase)} ${TRANSITION_TITLE_SUFFIX}`;
}

export function createTimedRoundTransitionKicker(targetPhase: TimedRoundPhase) {
  return `${TRANSITION_KICKER_PREFIX} ${targetPhase}`;
}
