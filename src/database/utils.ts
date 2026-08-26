import { DeckSize, SavedDeck, WordPair } from '@/features/GameSession/types';
import { isCompleteWordPair } from '@/features/GameSession/utils';

import { SavedDeckDatabaseRow } from './types';
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
