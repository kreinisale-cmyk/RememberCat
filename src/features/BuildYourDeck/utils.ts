import { WordPair } from '@/features/GameSession/types';

import { INPUT_AUTOMATION_ID_PREFIX, WORD_PAIR_SEPARATOR } from './constants';
import { WordPairField } from './types';

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
