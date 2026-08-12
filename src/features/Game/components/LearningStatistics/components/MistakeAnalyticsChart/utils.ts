import { WordPairLearningStatistics } from '../../../../types';

import { MINIMUM_MISTAKE_BAR_PERCENTAGE, MISTAKE_BAR_PERCENTAGE_MULTIPLIER } from './constants';

export function selectMistakeStatistics(learningStatistics: WordPairLearningStatistics[]) {
  return learningStatistics.filter((wordStatistics) => wordStatistics.mismatchCount > 0);
}

export function getHighestMismatchCount(mistakeStatistics: WordPairLearningStatistics[]) {
  return mistakeStatistics.reduce(
    (highestCount, wordStatistics) => Math.max(highestCount, wordStatistics.mismatchCount),
    0,
  );
}

export function createMistakeBarWidth(mismatchCount: number, highestMismatchCount: number) {
  if (highestMismatchCount <= 0) {
    return '0%' as const;
  }

  const relativePercentage =
    (mismatchCount / highestMismatchCount) * MISTAKE_BAR_PERCENTAGE_MULTIPLIER;
  const visiblePercentage = Math.max(relativePercentage, MINIMUM_MISTAKE_BAR_PERCENTAGE);

  return `${visiblePercentage}%` as const;
}

export function createMistakeCountLabel(mismatchCount: number) {
  if (mismatchCount === 1) {
    return '1 mistake';
  }

  return `${mismatchCount} mistakes`;
}
