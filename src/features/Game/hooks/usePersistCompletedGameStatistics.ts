import { useEffect, useRef } from 'react';

import { CompletedWordStatistic } from '@/features/GameSession/types';

import { GameStage } from '../types';

type UsePersistCompletedGameStatisticsOptions = {
  gameStage: GameStage;
  savedDeckId: string | null;
  completedWordStatistics: CompletedWordStatistic[];
  saveCompletedGameStatistics: (
    savedDeckId: string,
    completedWordStatistics: CompletedWordStatistic[],
  ) => Promise<boolean>;
};

export function usePersistCompletedGameStatistics({
  gameStage,
  savedDeckId,
  completedWordStatistics,
  saveCompletedGameStatistics,
}: UsePersistCompletedGameStatisticsOptions) {
  const hasPersistedCompletedGame = useRef(false);

  useEffect(() => {
    if (
      gameStage !== GameStage.LearningStatistics ||
      !savedDeckId ||
      hasPersistedCompletedGame.current
    ) {
      return;
    }

    hasPersistedCompletedGame.current = true;
    void saveCompletedGameStatistics(savedDeckId, completedWordStatistics);
  }, [completedWordStatistics, gameStage, saveCompletedGameStatistics, savedDeckId]);
}
