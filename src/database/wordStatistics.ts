import { CompletedWordStatistic, WordStatistic } from '@/features/GameSession/types';

import { WORD_STATISTICS_TABLE_NAME } from './constants';
import { getSavedDeckDatabase } from './savedDecks';
import { WordStatisticDatabaseRow } from './types';
import { parseWordStatisticDatabaseRow, shouldReplaceBestWordStatistic } from './utils';

export async function loadWordStatistics() {
  const database = await getSavedDeckDatabase();
  const rows = await database.getAllAsync<WordStatisticDatabaseRow>(`
    SELECT
      saved_deck_id AS savedDeckId,
      word_pair_id AS wordPairId,
      completed_game_count AS completedGameCount,
      best_accuracy AS bestAccuracy,
      best_correct_attempt_count AS bestCorrectAttemptCount,
      best_total_attempt_count AS bestTotalAttemptCount,
      last_played_at AS lastPlayedAt
    FROM ${WORD_STATISTICS_TABLE_NAME}
    ORDER BY last_played_at DESC
  `);

  return rows.map<WordStatistic>(parseWordStatisticDatabaseRow);
}

export async function persistCompletedWordStatistics(
  savedDeckId: string,
  completedWordStatistics: CompletedWordStatistic[],
) {
  const database = await getSavedDeckDatabase();
  const completedAt = Date.now();

  await database.withTransactionAsync(async () => {
    for (const wordStatistic of completedWordStatistics) {
      const previousStatistic = await database.getFirstAsync<{
        bestAccuracy: number;
        bestCorrectAttemptCount: number;
        bestTotalAttemptCount: number;
      }>(
        `SELECT
          best_accuracy AS bestAccuracy,
          best_correct_attempt_count AS bestCorrectAttemptCount,
          best_total_attempt_count AS bestTotalAttemptCount
         FROM ${WORD_STATISTICS_TABLE_NAME}
         WHERE saved_deck_id = $savedDeckId AND word_pair_id = $wordPairId`,
        { $savedDeckId: savedDeckId, $wordPairId: wordStatistic.wordPairId },
      );
      const shouldReplaceBest =
        !previousStatistic ||
        shouldReplaceBestWordStatistic(previousStatistic.bestAccuracy, wordStatistic.accuracy);
      const bestAccuracy = shouldReplaceBest
        ? wordStatistic.accuracy
        : previousStatistic.bestAccuracy;
      const bestCorrectAttemptCount = shouldReplaceBest
        ? wordStatistic.correctAttemptCount
        : previousStatistic.bestCorrectAttemptCount;
      const bestTotalAttemptCount = shouldReplaceBest
        ? wordStatistic.totalAttemptCount
        : previousStatistic.bestTotalAttemptCount;

      await database.runAsync(
        `INSERT INTO ${WORD_STATISTICS_TABLE_NAME} (
          saved_deck_id,
          word_pair_id,
          completed_game_count,
          best_accuracy,
          best_correct_attempt_count,
          best_total_attempt_count,
          last_played_at
        ) VALUES (
          $savedDeckId,
          $wordPairId,
          1,
          $bestAccuracy,
          $bestCorrectAttemptCount,
          $bestTotalAttemptCount,
          $completedAt
        )
        ON CONFLICT(saved_deck_id, word_pair_id) DO UPDATE SET
          completed_game_count = completed_game_count + 1,
          best_accuracy = excluded.best_accuracy,
          best_correct_attempt_count = excluded.best_correct_attempt_count,
          best_total_attempt_count = excluded.best_total_attempt_count,
          last_played_at = excluded.last_played_at`,
        {
          $savedDeckId: savedDeckId,
          $wordPairId: wordStatistic.wordPairId,
          $bestAccuracy: bestAccuracy,
          $bestCorrectAttemptCount: bestCorrectAttemptCount,
          $bestTotalAttemptCount: bestTotalAttemptCount,
          $completedAt: completedAt,
        },
      );
    }
  });
}
