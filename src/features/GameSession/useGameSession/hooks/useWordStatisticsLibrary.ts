import { useCallback, useEffect, useState } from 'react';

import {
  loadWordMasteries,
  loadWordStatistics,
  persistCompletedWordStatistics,
} from '@/database/wordStatistics';

import { WORD_STATISTICS_ERROR_MESSAGE } from '../../constants';
import { PersistAssessmentOptions, WordMastery, WordStatistic } from '../../types';

export function useWordStatisticsLibrary() {
  const [wordStatistics, setWordStatistics] = useState<WordStatistic[]>([]);
  const [wordMasteries, setWordMasteries] = useState<WordMastery[]>([]);
  const [isWordStatisticsLoading, setIsWordStatisticsLoading] = useState(true);
  const [wordStatisticsError, setWordStatisticsError] = useState<string | null>(null);

  const refreshWordStatistics = useCallback(async () => {
    const [storedWordStatistics, storedWordMasteries] = await Promise.all([
      loadWordStatistics(),
      loadWordMasteries(),
    ]);

    setWordStatistics(storedWordStatistics);
    setWordMasteries(storedWordMasteries);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeWordStatistics() {
      try {
        const [storedWordStatistics, storedWordMasteries] = await Promise.all([
          loadWordStatistics(),
          loadWordMasteries(),
        ]);

        if (isMounted) {
          setWordStatistics(storedWordStatistics);
          setWordMasteries(storedWordMasteries);
        }
      } catch {
        if (isMounted) {
          setWordStatisticsError(WORD_STATISTICS_ERROR_MESSAGE);
        }
      } finally {
        if (isMounted) {
          setIsWordStatisticsLoading(false);
        }
      }
    }

    void initializeWordStatistics();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveAssessmentStatistics = useCallback(
    async ({
      savedDeckId,
      completedWordStatistics,
      assessmentStatistics,
      seenWordPairIds,
      missedWordPairIds,
      updateBestStatistics,
    }: PersistAssessmentOptions) => {
      try {
        await persistCompletedWordStatistics(
          savedDeckId,
          completedWordStatistics,
          assessmentStatistics,
          seenWordPairIds,
          missedWordPairIds,
          updateBestStatistics,
        );
        await refreshWordStatistics();
        setWordStatisticsError(null);

        return true;
      } catch {
        setWordStatisticsError(WORD_STATISTICS_ERROR_MESSAGE);

        return false;
      }
    },
    [refreshWordStatistics],
  );

  return {
    wordStatistics,
    wordMasteries,
    isWordStatisticsLoading,
    wordStatisticsError,
    refreshWordStatistics,
    saveAssessmentStatistics,
  };
}
