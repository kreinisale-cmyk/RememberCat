import {
  CompletedAssessmentStatistic,
  CompletedWordStatistic,
  WordMastery,
  WordStatistic,
} from '@/features/GameSession/types';

import { WORD_MASTERY_TABLE_NAME, WORD_STATISTICS_TABLE_NAME } from './constants';
import { getSavedDeckDatabase } from './savedDecks';
import { WordMasteryDatabaseRow, WordStatisticDatabaseRow } from './types';
import {
  parseWordMasteryDatabaseRow,
  parseWordStatisticDatabaseRow,
  shouldReplaceBestWordStatistic,
} from './utils';

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

export async function loadWordMasteries() {
  const database = await getSavedDeckDatabase();
  const rows = await database.getAllAsync<WordMasteryDatabaseRow>(`
    SELECT
      saved_deck_id AS savedDeckId,
      word_pair_id AS wordPairId,
      completed_assessment_count AS completedAssessmentCount,
      lifetime_correct_attempt_count AS lifetimeCorrectAttemptCount,
      lifetime_incorrect_attempt_count AS lifetimeIncorrectAttemptCount,
      clean_assessment_streak AS cleanAssessmentStreak,
      latest_accuracy AS latestAccuracy,
      last_seen_at AS lastSeenAt,
      last_missed_at AS lastMissedAt
    FROM ${WORD_MASTERY_TABLE_NAME}
    ORDER BY last_seen_at DESC
  `);

  return rows.map<WordMastery>(parseWordMasteryDatabaseRow);
}

export async function persistCompletedWordStatistics(
  savedDeckId: string,
  completedWordStatistics: CompletedWordStatistic[],
  assessmentStatistics: CompletedAssessmentStatistic[],
  seenWordPairIds: string[],
  missedWordPairIds: string[],
  updateBestStatistics: boolean,
) {
  const database = await getSavedDeckDatabase();
  const completedAt = Date.now();

  await database.withTransactionAsync(async () => {
    for (const wordStatistic of completedWordStatistics) {
      if (!updateBestStatistics || wordStatistic.totalAttemptCount === 0) {
        continue;
      }

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

    const missedWordPairIdSet = new Set(missedWordPairIds);

    for (const wordPairId of new Set(seenWordPairIds)) {
      const lastMissedAt = missedWordPairIdSet.has(wordPairId) ? completedAt : null;

      await database.runAsync(
        `INSERT INTO ${WORD_MASTERY_TABLE_NAME} (
          saved_deck_id,
          word_pair_id,
          completed_assessment_count,
          lifetime_correct_attempt_count,
          lifetime_incorrect_attempt_count,
          clean_assessment_streak,
          latest_accuracy,
          last_seen_at,
          last_missed_at
        ) VALUES ($savedDeckId, $wordPairId, 0, 0, 0, 0, 0, $completedAt, $lastMissedAt)
        ON CONFLICT(saved_deck_id, word_pair_id) DO UPDATE SET
          last_seen_at = excluded.last_seen_at,
          last_missed_at = COALESCE(excluded.last_missed_at, last_missed_at)`,
        {
          $savedDeckId: savedDeckId,
          $wordPairId: wordPairId,
          $completedAt: completedAt,
          $lastMissedAt: lastMissedAt,
        },
      );
    }

    for (const assessmentStatistic of assessmentStatistics) {
      if (assessmentStatistic.totalAttemptCount === 0) {
        continue;
      }

      const cleanAssessmentStreak = assessmentStatistic.accuracy === 100 ? 1 : 0;
      const lastMissedAt =
        assessmentStatistic.correctAttemptCount < assessmentStatistic.totalAttemptCount
          ? completedAt
          : null;

      await database.runAsync(
        `INSERT INTO ${WORD_MASTERY_TABLE_NAME} (
          saved_deck_id,
          word_pair_id,
          completed_assessment_count,
          lifetime_correct_attempt_count,
          lifetime_incorrect_attempt_count,
          clean_assessment_streak,
          latest_accuracy,
          last_seen_at,
          last_missed_at
        ) VALUES (
          $savedDeckId,
          $wordPairId,
          1,
          $correctAttemptCount,
          $incorrectAttemptCount,
          $cleanAssessmentStreak,
          $latestAccuracy,
          $completedAt,
          $lastMissedAt
        )
        ON CONFLICT(saved_deck_id, word_pair_id) DO UPDATE SET
          completed_assessment_count = completed_assessment_count + 1,
          lifetime_correct_attempt_count = lifetime_correct_attempt_count + excluded.lifetime_correct_attempt_count,
          lifetime_incorrect_attempt_count = lifetime_incorrect_attempt_count + excluded.lifetime_incorrect_attempt_count,
          clean_assessment_streak = CASE
            WHEN excluded.latest_accuracy = 100 THEN clean_assessment_streak + 1
            ELSE 0
          END,
          latest_accuracy = excluded.latest_accuracy,
          last_seen_at = excluded.last_seen_at,
          last_missed_at = COALESCE(excluded.last_missed_at, last_missed_at)`,
        {
          $savedDeckId: savedDeckId,
          $wordPairId: assessmentStatistic.wordPairId,
          $correctAttemptCount: assessmentStatistic.correctAttemptCount,
          $incorrectAttemptCount:
            assessmentStatistic.totalAttemptCount - assessmentStatistic.correctAttemptCount,
          $cleanAssessmentStreak: cleanAssessmentStreak,
          $latestAccuracy: assessmentStatistic.accuracy,
          $completedAt: completedAt,
          $lastMissedAt: lastMissedAt,
        },
      );
    }
  });
}
