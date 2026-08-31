import { DeckSize, SavedDeck, WordPair } from '@/features/GameSession/types';

import { INPUT_AUTOMATION_ID_PREFIX, WORD_PAIR_SEPARATOR } from './constants';
import { BuildYourDeckEntryMode, BuildYourDeckEntryOrigin, WordPairField } from './types';

export function createWordPair(word: string, translation: string): WordPair {
  return {
    id: `${INPUT_AUTOMATION_ID_PREFIX}${Date.now()}-${Math.random()}`,
    word: word.trim(),
    translation: translation.trim(),
  };
}

export function parseWordPairFile(contents: string): WordPair[] {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const separatorIndex = line.indexOf(WORD_PAIR_SEPARATOR);

      if (separatorIndex < 1) return [];

      const word = line.slice(0, separatorIndex).trim();
      const translation = line.slice(separatorIndex + WORD_PAIR_SEPARATOR.length).trim();

      return word && translation ? [createWordPair(word, translation)] : [];
    });
}
export function updateWordPair(pairs: WordPair[], id: string, field: WordPairField, value: string) {
  return pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair));
}
export function removeWordPair(pairs: WordPair[], id: string) {
  return pairs.filter((pair) => pair.id !== id);
}

export function hasCompleteWordPair({ word, translation }: WordPair) {
  return Boolean(word.trim() && translation.trim());
}

export function filterSavedDecksByDeckSize(savedDecks: SavedDeck[], deckSize: DeckSize) {
  return savedDecks
    .filter((savedDeck) => savedDeck.pairCount === deckSize)
    .sort(
      (firstSavedDeck, secondSavedDeck) => secondSavedDeck.updatedAt - firstSavedDeck.updatedAt,
    );
}

export function parseBuildYourDeckEntryMode(mode: string | string[] | undefined) {
  const resolvedMode = Array.isArray(mode) ? mode[0] : mode;

  if (
    resolvedMode === BuildYourDeckEntryMode.Create ||
    resolvedMode === BuildYourDeckEntryMode.Edit
  ) {
    return resolvedMode;
  }

  return BuildYourDeckEntryMode.Library;
}

export function parseBuildYourDeckEntryOrigin(origin: string | string[] | undefined) {
  const resolvedOrigin = Array.isArray(origin) ? origin[0] : origin;

  if (resolvedOrigin === BuildYourDeckEntryOrigin.GameSetup) {
    return BuildYourDeckEntryOrigin.GameSetup;
  }

  return BuildYourDeckEntryOrigin.Words;
}

export function parseSingleRouteParameter(parameter: string | string[] | undefined) {
  return Array.isArray(parameter) ? parameter[0] : parameter;
}
