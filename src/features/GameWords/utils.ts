import { WordPair } from '@/features/GameSession/types';

import { INPUT_AUTOMATION_ID_PREFIX } from './constants';
import { WordPairField } from './types';

export function createWordPair(word: string, translation: string): WordPair {
  return {
    id: `${INPUT_AUTOMATION_ID_PREFIX}${Date.now()}`,
    word: word.trim(),
    translation: translation.trim(),
  };
}
export function updateWordPair(pairs: WordPair[], id: string, field: WordPairField, value: string) {
  return pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair));
}
export function removeWordPair(pairs: WordPair[], id: string) {
  return pairs.filter((pair) => pair.id !== id);
}
