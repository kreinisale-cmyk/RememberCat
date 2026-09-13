import { WordPair } from '@/features/GameSession/types';

export function createPreparationSlotLabel(index: number, isPrepared: boolean, wordPair: WordPair) {
  if (isPrepared) {
    return `Prepared word ${index + 1}: ${wordPair.word}, ${wordPair.translation}`;
  }

  return `Empty preparation slot ${index + 1}`;
}
