import * as SQLite from 'expo-sqlite';

import { SavedDeck, WordPair } from '@/features/GameSession/types';

import { SAVED_DECK_DATABASE_NAME, SAVED_DECK_TABLE_NAME } from './constants';
import { SavedDeckDatabaseRow } from './types';
import {
  createSavedDeckId,
  createSavedDeckName,
  createSavedDeckSignature,
  parseSavedDeckDatabaseRow,
} from './utils';

let savedDeckDatabasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getSavedDeckDatabase() {
  if (!savedDeckDatabasePromise) {
    savedDeckDatabasePromise = SQLite.openDatabaseAsync(SAVED_DECK_DATABASE_NAME);
  }

  const database = await savedDeckDatabasePromise;

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${SAVED_DECK_TABLE_NAME} (
      id TEXT PRIMARY KEY NOT NULL,
      signature TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      pairs_json TEXT NOT NULL,
      pair_count INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
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
  const savedDeckValues = {
    $id: savedDeckId ?? createSavedDeckId(),
    $signature: signature,
    $name: createSavedDeckName(pairs),
    $pairsJson: JSON.stringify(pairs),
    $pairCount: pairs.length,
    $updatedAt: Date.now(),
  };

  if (savedDeckId) {
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
      return;
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
}

export async function deleteSavedDeck(savedDeckId: string) {
  const database = await getSavedDeckDatabase();

  await database.runAsync(`DELETE FROM ${SAVED_DECK_TABLE_NAME} WHERE id = $id`, {
    $id: savedDeckId,
  });
}
