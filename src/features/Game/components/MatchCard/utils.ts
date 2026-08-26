import { MatchCelebrationAnimation } from '../../types';
import {
  MATCHED_OPTION_ACCESSIBILITY_SUFFIX,
  MATCH_OPTION_ACCESSIBILITY_LABEL_PREFIX,
  PORTAL_CARD_END_ROTATION_DEGREES,
  PORTAL_CARD_END_SCALE,
  PORTAL_CARD_HORIZONTAL_DISTANCE,
  PORTAL_CARD_VERTICAL_DISTANCE,
  SHATTER_CARD_END_ROTATION_DEGREES,
  SHATTER_CARD_END_SCALE,
  SHATTER_CARD_HORIZONTAL_DISTANCE,
  SHATTER_CARD_VERTICAL_DISTANCE,
} from './constants';
import { MatchCardCelebrationMotionOutputRanges, MatchCardSide } from './types';

export function createMatchOptionAccessibilityLabel(label: string, completed: boolean) {
  const completedLabel = completed ? MATCHED_OPTION_ACCESSIBILITY_SUFFIX : '';

  return `${MATCH_OPTION_ACCESSIBILITY_LABEL_PREFIX} ${label}${completedLabel}`;
}

export function getMatchCardMotionDirection(side: MatchCardSide) {
  if (side === MatchCardSide.Word) {
    return 1;
  }

  return -1;
}

export function createMatchCardCelebrationMotionOutputRanges(
  celebrationAnimation: MatchCelebrationAnimation | null,
  motionDirection: number,
): MatchCardCelebrationMotionOutputRanges {
  if (celebrationAnimation === MatchCelebrationAnimation.Shatter) {
    return {
      opacity: [1, 1, 0.82, 0],
      scale: [1, 1.12, 0.94, 0.76, SHATTER_CARD_END_SCALE],
      translateX: [
        0,
        motionDirection * 3,
        motionDirection * -2,
        motionDirection * 5,
        motionDirection * SHATTER_CARD_HORIZONTAL_DISTANCE,
      ],
      translateY: [0, -2, 2, -5, SHATTER_CARD_VERTICAL_DISTANCE],
      rotation: [
        '0deg',
        `${motionDirection * -2}deg`,
        `${motionDirection * 2}deg`,
        `${motionDirection * -4}deg`,
        `${motionDirection * SHATTER_CARD_END_ROTATION_DEGREES}deg`,
      ],
      rotationY: ['0deg', '0deg', '0deg', '0deg', '0deg'],
    };
  } else if (celebrationAnimation === MatchCelebrationAnimation.Portal) {
    return {
      opacity: [1, 1, 0.82, 0],
      scale: [1, 1.08, 0.95, 0.52, PORTAL_CARD_END_SCALE],
      translateX: [
        0,
        motionDirection,
        motionDirection * 3,
        motionDirection * 8,
        motionDirection * PORTAL_CARD_HORIZONTAL_DISTANCE,
      ],
      translateY: [0, -2, 1, -3, PORTAL_CARD_VERTICAL_DISTANCE],
      rotation: [
        '0deg',
        `${motionDirection * -5}deg`,
        `${motionDirection * 20}deg`,
        `${motionDirection * 100}deg`,
        `${motionDirection * PORTAL_CARD_END_ROTATION_DEGREES}deg`,
      ],
      rotationY: [
        '0deg',
        `${motionDirection * -8}deg`,
        `${motionDirection * 34}deg`,
        `${motionDirection * 68}deg`,
        `${motionDirection * 88}deg`,
      ],
    };
  } else {
    return {
      opacity: [1, 1, 1, 1],
      scale: [1, 1, 1, 1, 1],
      translateX: [0, 0, 0, 0, 0],
      translateY: [0, 0, 0, 0, 0],
      rotation: ['0deg', '0deg', '0deg', '0deg', '0deg'],
      rotationY: ['0deg', '0deg', '0deg', '0deg', '0deg'],
    };
  }
}
