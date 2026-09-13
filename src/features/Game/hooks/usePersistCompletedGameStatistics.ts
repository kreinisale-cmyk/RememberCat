import { useEffect, useRef } from 'react';

import {
  CompletedAssessmentStatistic,
  PersistAssessmentOptions,
} from '@/features/GameSession/types';

import { CompletedGameResult, FocusedReviewState } from '../types';

type UsePersistCompletedGameStatisticsOptions = {
  savedDeckId: string | null;
  gameResult: CompletedGameResult | null;
  focusedReviewState: FocusedReviewState;
  focusedReviewAssessmentStatistics: CompletedAssessmentStatistic[];
  focusedReviewWordStatistics: CompletedAssessmentStatistic[];
  saveAssessmentStatistics: (options: PersistAssessmentOptions) => Promise<boolean>;
};

export function usePersistCompletedGameStatistics({
  savedDeckId,
  gameResult,
  focusedReviewState,
  focusedReviewAssessmentStatistics,
  focusedReviewWordStatistics,
  saveAssessmentStatistics,
}: UsePersistCompletedGameStatisticsOptions) {
  const hasPersistedPrimaryAssessment = useRef(false);
  const hasPersistedFocusedReviewAssessment = useRef(false);

  useEffect(() => {
    if (!savedDeckId || !gameResult || hasPersistedPrimaryAssessment.current) {
      return;
    }

    hasPersistedPrimaryAssessment.current = true;
    void saveAssessmentStatistics({
      savedDeckId,
      completedWordStatistics: gameResult.completedWordStatistics,
      assessmentStatistics: gameResult.assessmentStatistics,
      seenWordPairIds: gameResult.completedWordStatistics
        .filter((statistic) => statistic.totalAttemptCount > 0)
        .map((statistic) => statistic.wordPairId),
      missedWordPairIds: gameResult.missedWordPairIds,
      updateBestStatistics: true,
    });
  }, [gameResult, saveAssessmentStatistics, savedDeckId]);

  useEffect(() => {
    if (
      !savedDeckId ||
      focusedReviewState !== FocusedReviewState.Complete ||
      hasPersistedFocusedReviewAssessment.current
    ) {
      return;
    }

    hasPersistedFocusedReviewAssessment.current = true;
    void saveAssessmentStatistics({
      savedDeckId,
      completedWordStatistics: [],
      assessmentStatistics: focusedReviewAssessmentStatistics,
      seenWordPairIds: focusedReviewWordStatistics
        .filter((statistic) => statistic.totalAttemptCount > 0)
        .map((statistic) => statistic.wordPairId),
      missedWordPairIds: focusedReviewWordStatistics
        .filter((statistic) => statistic.correctAttemptCount < statistic.totalAttemptCount)
        .map((statistic) => statistic.wordPairId),
      updateBestStatistics: false,
    });
  }, [
    focusedReviewAssessmentStatistics,
    focusedReviewState,
    focusedReviewWordStatistics,
    saveAssessmentStatistics,
    savedDeckId,
  ]);
}
