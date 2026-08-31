import { useCallback, useEffect, useState } from 'react';

import { loadWordStatistics, persistCompletedWordStatistics } from '@/database/wordStatistics';

import { WORD_STATISTICS_ERROR_MESSAGE } from '../../constants';
import { CompletedWordStatistic, WordStatistic } from '../../types';

export function useWordStatisticsLibrary() {
  const [wordStatistics, setWordStatistics] = useState<WordStatistic[]>([]);
  const [isWordStatisticsLoading, setIsWordStatisticsLoading] = useState(true);
  const [wordStatisticsError, setWordStatisticsError] = useState<string | null>(null);

  const refreshWordStatistics = useCallback(async () => {
    const storedWordStatistics = await loadWordStatistics();

    setWordStatistics(storedWordStatistics);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeWordStatistics() {
      try {
        const storedWordStatistics = await loadWordStatistics();

        if (isMounted) {
          setWordStatistics(storedWordStatistics);
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

  const saveCompletedGameStatistics = useCallback(
    async (savedDeckId: string, completedWordStatistics: CompletedWordStatistic[]) => {
      try {
        await persistCompletedWordStatistics(savedDeckId, completedWordStatistics);
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
    isWordStatisticsLoading,
    wordStatisticsError,
    refreshWordStatistics,
    saveCompletedGameStatistics,
  };
}
