import { FINAL_QUIZ_PROGRESS_PERCENTAGE_MULTIPLIER } from './constants';

export function createFinalQuizProgressLabel(
  passedWordPairCount: number,
  totalWordPairCount: number,
) {
  return `${passedWordPairCount}/${totalWordPairCount}`;
}

export function createFinalQuizProgressWidth(
  passedWordPairCount: number,
  totalWordPairCount: number,
) {
  if (totalWordPairCount <= 0) {
    return '0%' as const;
  }

  const progress = Math.min(Math.max(passedWordPairCount / totalWordPairCount, 0), 1);

  return `${progress * FINAL_QUIZ_PROGRESS_PERCENTAGE_MULTIPLIER}%` as const;
}
