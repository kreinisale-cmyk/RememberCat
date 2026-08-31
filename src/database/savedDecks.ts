import * as SQLite from 'expo-sqlite';

import { SavedDeck, WordPair } from '@/features/GameSession/types';

import {
  SAVED_DECK_DATABASE_NAME,
  SAVED_DECK_TABLE_NAME,
  WORD_STATISTICS_TABLE_NAME,
} from './constants';
import { SavedDeckDatabaseRow } from './types';
import {
  createSavedDeckId,
  createSavedDeckName,
  createSavedDeckSignature,
  findChangedWordPairIds,
  parseSavedDeckDatabaseRow,
} from './utils';

let savedDeckDatabasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getSavedDeckDatabase() {
  if (!savedDeckDatabasePromise) {
    savedDeckDatabasePromise = SQLite.openDatabaseAsync(SAVED_DECK_DATABASE_NAME);
  }

  const database = await savedDeckDatabasePromise;

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS ${SAVED_DECK_TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      signature TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      pairs_json TEXT NOT NULL,
      pair_count INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ${WORD_STATISTICS_TABLE_NAME} (
      saved_deck_id TEXT NOT NULL,
      word_pair_id TEXT NOT NULL,
      completed_game_count INTEGER NOT NULL DEFAULT 0,
      best_accuracy REAL NOT NULL DEFAULT 0,
      best_correct_attempt_count INTEGER NOT NULL DEFAULT 0,
      best_total_attempt_count INTEGER NOT NULL DEFAULT 0,
      last_played_at INTEGER NOT NULL,
      PRIMARY KEY (saved_deck_id, word_pair_id),
      FOREIGN KEY (saved_deck_id) REFERENCES ${SAVED_DECK_TABLE_NAME}(id) ON DELETE CASCADE
    );
  `);

  return database;
}

export async function loadSavedDecks() {
  const database = await getSavedDeckDatabase();
  const rows = await database.getAllAsync<SavedDeckDatabaseRow>(`
    SELECT
      id,
      name,
      pairs_json AS pairsJson,
      pair_count AS pairCount,
      updated_at AS updatedAt
    FROM ${SAVED_DECK_TABLE_NAME}
    ORDER BY updated_at DESC
  `);

  return rows.flatMap<SavedDeck>((row) => {
    const savedDeck = parseSavedDeckDatabaseRow(row);

    return savedDeck ? [savedDeck] : [];
  });
}

export async function persistSavedDeck(pairs: WordPair[], savedDeckId?: string) {
  const database = await getSavedDeckDatabase();
  const signature = createSavedDeckSignature(pairs);
  const signatureMatchRow = await database.getFirstAsync<{ id: string; pairsJson: string }>(
    `SELECT id, pairs_json AS pairsJson
     FROM ${SAVED_DECK_TABLE_NAME}
     WHERE signature = $signature`,
    { $signature: signature },
  );
  const savedDeckValues = {
    $id: savedDeckId ?? createSavedDeckId(),
    $signature: signature,
    $name: createSavedDeckName(pairs),
    $pairsJson: JSON.stringify(pairs),
    $pairCount: pairs.length,
    $updatedAt: Date.now(),
  };

  if (savedDeckId) {
    const previousDeckRow = await database.getFirstAsync<{ pairsJson: string }>(
      `SELECT pairs_json AS pairsJson FROM ${SAVED_DECK_TABLE_NAME} WHERE id = $id`,
      { $id: savedDeckId },
    );
    const updateResult = await database.runAsync(
      `UPDATE ${SAVED_DECK_TABLE_NAME}
       SET signature = $signature,
           name = $name,
           pairs_json = $pairsJson,
           pair_count = $pairCount,
           updated_at = $updatedAt
       WHERE id = $id`,
      savedDeckValues,
    );

    if (updateResult.changes > 0) {
      if (previousDeckRow) {
        const previousPairs = JSON.parse(previousDeckRow.pairsJson) as WordPair[];
        const changedWordPairIds = findChangedWordPairIds(previousPairs, pairs);

        for (const wordPairId of changedWordPairIds) {
          await database.runAsync(
            `DELETE FROM ${WORD_STATISTICS_TABLE_NAME}
             WHERE saved_deck_id = $savedDeckId AND word_pair_id = $wordPairId`,
            { $savedDeckId: savedDeckId, $wordPairId: wordPairId },
          );
        }
      }

      return savedDeckId;
    }
  }

  await database.runAsync(
    `INSERT INTO ${SAVED_DECK_TABLE_NAME}
      (id, signature, name, pairs_json, pair_count, updated_at)
     VALUES ($id, $signature, $name, $pairsJson, $pairCount, $updatedAt)
     ON CONFLICT(signature) DO UPDATE SET
       name = excluded.name,
       pairs_json = excluded.pairs_json,
       pair_count = excluded.pair_count,
       updated_at = excluded.updated_at`,
    savedDeckValues,
  );

  if (signatureMatchRow) {
    const previousPairs = JSON.parse(signatureMatchRow.pairsJson) as WordPair[];
    const changedWordPairIds = findChangedWordPairIds(previousPairs, pairs);

    for (const wordPairId of changedWordPairIds) {
      await database.runAsync(
        `DELETE FROM ${WORD_STATISTICS_TABLE_NAME}
         WHERE saved_deck_id = $savedDeckId AND word_pair_id = $wordPairId`,
        { $savedDeckId: signatureMatchRow.id, $wordPairId: wordPairId },
      );
    }
  }

  const savedDeckRow = await database.getFirstAsync<{ id: string }>(
    `SELECT id FROM ${SAVED_DECK_TABLE_NAME} WHERE signature = $signature`,
    { $signature: signature },
  );

  if (!savedDeckRow) {
    throw new Error('The saved word list could not be resolved after saving.');
  }

  return savedDeckRow.id;
}

export async function deleteSavedDeck(savedDeckId: string) {
  const database = await getSavedDeckDatabase();

  await database.withTransactionAsync(async () => {
    await database.runAsync(`DELETE FROM ${WORD_STATISTICS_TABLE_NAME} WHERE saved_deck_id = $id`, {
      $id: savedDeckId,
    });
    await database.runAsync(`DELETE FROM ${SAVED_DECK_TABLE_NAME} WHERE id = $id`, {
      $id: savedDeckId,
    });
  });
}
