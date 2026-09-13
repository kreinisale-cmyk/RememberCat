import { WordMastery, WordStatistic } from '@/features/GameSession/types';

export function createWordStatisticKey(savedDeckId: string, wordPairId: string) {
  return `${savedDeckId}\u0000${wordPairId}`;
}

export function createWordMasteryLookup(wordMasteries: WordMastery[]) {
  return new Map(
    wordMasteries.map((wordMastery) => [
      createWordStatisticKey(wordMastery.savedDeckId, wordMastery.wordPairId),
      wordMastery,
    ]),
  );
}

export function createWordStatisticLookup(wordStatistics: WordStatistic[]) {
  return new Map(
    wordStatistics.map((wordStatistic) => [
      createWordStatisticKey(wordStatistic.savedDeckId, wordStatistic.wordPairId),
      wordStatistic,
    ]),
  );
}
