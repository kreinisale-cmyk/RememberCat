import { DeckSize, SavedDeck, WordPair, WordStatistic } from '@/features/GameSession/types';
import { isCompleteWordPair } from '@/features/GameSession/utils';

import { SavedDeckDatabaseRow, WordStatisticDatabaseRow } from './types';
import { SUPPORTED_SAVED_DECK_SIZES } from './constants';

export function createSavedDeckName(pairs: WordPair[]) {
  const firstWord = pairs[0]?.word.trim() ?? 'Vocabulary';
  const secondWord = pairs[1]?.word.trim();

  if (secondWord) {
    return `${firstWord}, ${secondWord} + ${Math.max(pairs.length - 2, 0)}`;
  }

  return firstWord;
}

export function createSavedDeckSignature(pairs: WordPair[]) {
  return pairs
    .map(
      (pair) =>
        `${pair.word.trim().toLocaleLowerCase()}\u0000${pair.translation
          .trim()
          .toLocaleLowerCase()}`,
    )
    .join('\u0001');
}

export function createSavedDeckId() {
  return `deck-${Date.now()}-${Math.random()}`;
}

export function parseSavedDeckDatabaseRow(row: SavedDeckDatabaseRow): SavedDeck | null {
  try {
    const pairs = JSON.parse(row.pairsJson) as WordPair[];

    if (
      !SUPPORTED_SAVED_DECK_SIZES.includes(row.pairCount) ||
      !Array.isArray(pairs) ||
      pairs.length !== row.pairCount ||
      !pairs.every(isCompleteWordPair)
    ) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      pairs,
      pairCount: row.pairCount as DeckSize,
      updatedAt: row.updatedAt,
    };
  } catch {
    return null;
  }
}

export function findChangedWordPairIds(previousPairs: WordPair[], nextPairs: WordPair[]) {
  const nextPairById = new Map(nextPairs.map((wordPair) => [wordPair.id, wordPair]));

  return previousPairs.flatMap((previousPair) => {
    const nextPair = nextPairById.get(previousPair.id);
    const hasChanged =
      !nextPair ||
      previousPair.word.trim() !== nextPair.word.trim() ||
      previousPair.translation.trim() !== nextPair.translation.trim();

    return hasChanged ? [previousPair.id] : [];
  });
}

export function parseWordStatisticDatabaseRow(row: WordStatisticDatabaseRow): WordStatistic {
  return {
    savedDeckId: row.savedDeckId,
    wordPairId: row.wordPairId,
    completedGameCount: row.completedGameCount,
    bestAccuracy: row.bestAccuracy,
    bestCorrectAttemptCount: row.bestCorrectAttemptCount,
    bestTotalAttemptCount: row.bestTotalAttemptCount,
    lastPlayedAt: row.lastPlayedAt,
  };
}

export function shouldReplaceBestWordStatistic(
  previousBestAccuracy: number,
  completedGameAccuracy: number,
) {
  return completedGameAccuracy > previousBestAccuracy;
}
