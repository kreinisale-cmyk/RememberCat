import { DeckSize, SavedDeck, WordPair } from '@/features/GameSession/types';

import { INPUT_AUTOMATION_ID_PREFIX, WORD_PAIR_SEPARATOR } from './constants';
import {
  BuildYourDeckEntryMode,
  BuildYourDeckEntryOrigin,
  WordPairConflict,
  WordPairAdditionSource,
  WordPairField,
} from './types';

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

export function normalizeComparableWordPairValue(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function findWordPairConflicts(pairs: WordPair[]): WordPairConflict[] {
  const wordIdsByValue = new Map<string, string[]>();
  const translationIdsByValue = new Map<string, string[]>();

  for (const pair of pairs) {
    const word = normalizeComparableWordPairValue(pair.word);
    const translation = normalizeComparableWordPairValue(pair.translation);

    if (word) {
      wordIdsByValue.set(word, [...(wordIdsByValue.get(word) ?? []), pair.id]);
    }

    if (translation) {
      translationIdsByValue.set(translation, [
        ...(translationIdsByValue.get(translation) ?? []),
        pair.id,
      ]);
    }
  }

  const fieldsByPairId = new Map<string, Set<WordPairField>>();

  for (const duplicateWordPairIds of wordIdsByValue.values()) {
    if (duplicateWordPairIds.length > 1) {
      duplicateWordPairIds.forEach((wordPairId) => {
        const fields = fieldsByPairId.get(wordPairId) ?? new Set<WordPairField>();
        fields.add(WordPairField.Word);
        fieldsByPairId.set(wordPairId, fields);
      });
    }
  }

  for (const duplicateTranslationPairIds of translationIdsByValue.values()) {
    if (duplicateTranslationPairIds.length > 1) {
      duplicateTranslationPairIds.forEach((wordPairId) => {
        const fields = fieldsByPairId.get(wordPairId) ?? new Set<WordPairField>();
        fields.add(WordPairField.Translation);
        fieldsByPairId.set(wordPairId, fields);
      });
    }
  }

  return [...fieldsByPairId.entries()].map(([wordPairId, fields]) => ({
    wordPairId,
    fields: [...fields],
  }));
}

export function findCandidateWordPairConflict(pairs: WordPair[], candidate: WordPair) {
  const candidateWord = normalizeComparableWordPairValue(candidate.word);
  const candidateTranslation = normalizeComparableWordPairValue(candidate.translation);

  return pairs.some((pair) => {
    return (
      normalizeComparableWordPairValue(pair.word) === candidateWord ||
      normalizeComparableWordPairValue(pair.translation) === candidateTranslation
    );
  });
}

export function selectUniqueWordPairs(
  existingPairs: WordPair[],
  incomingPairs: WordPair[],
  availableSlots: number,
) {
  const acceptedPairs: WordPair[] = [];
  let skippedPairCount = 0;

  for (const incomingPair of incomingPairs) {
    if (acceptedPairs.length >= availableSlots) {
      break;
    }

    if (findCandidateWordPairConflict([...existingPairs, ...acceptedPairs], incomingPair)) {
      skippedPairCount += 1;
    } else {
      acceptedPairs.push(incomingPair);
    }
  }

  return { acceptedPairs, skippedPairCount };
}

export function createWordPairAdditionMessage(
  source: WordPairAdditionSource,
  addedPairCount: number,
  skippedPairCount: number,
) {
  if (addedPairCount === 0 && skippedPairCount > 0) {
    return `Skipped ${skippedPairCount} duplicate pair${skippedPairCount === 1 ? '' : 's'}.`;
  } else if (addedPairCount === 0) {
    return 'No valid word - translation pairs found.';
  }

  const action = source === WordPairAdditionSource.Import ? 'Imported' : 'Added';
  let message = `${action} ${addedPairCount} word pair${addedPairCount === 1 ? '' : 's'}`;

  if (skippedPairCount > 0) {
    message += ` and skipped ${skippedPairCount} duplicate${skippedPairCount === 1 ? '' : 's'}`;
  }

  return `${message}.`;
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
