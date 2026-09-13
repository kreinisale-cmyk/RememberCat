import { useCallback } from 'react';

import { WordPair } from '@/features/GameSession/types';

import { WordPairAdditionSource } from '../types';
import { createWordPairAdditionMessage, parseWordPairFile, selectUniqueWordPairs } from '../utils';

type UseBulkAddWordPairsOptions = {
  pairs: WordPair[];
  wordPairLimit: number;
  setDraftPairs: (pairs: WordPair[]) => void;
  setImportMessage: (message: string) => void;
};

export function useBulkAddWordPairs({
  pairs,
  wordPairLimit,
  setDraftPairs,
  setImportMessage,
}: UseBulkAddWordPairsOptions) {
  return useCallback(
    (contents: string) => {
      const availableSlots = wordPairLimit - pairs.length;
      const parsedPairs = parseWordPairFile(contents);
      const { acceptedPairs, skippedPairCount } = selectUniqueWordPairs(
        pairs,
        parsedPairs,
        availableSlots,
      );

      if (!acceptedPairs.length) {
        setImportMessage(
          createWordPairAdditionMessage(WordPairAdditionSource.Bulk, 0, skippedPairCount),
        );

        return false;
      }

      setDraftPairs([...acceptedPairs, ...pairs]);
      setImportMessage(
        createWordPairAdditionMessage(
          WordPairAdditionSource.Bulk,
          acceptedPairs.length,
          skippedPairCount,
        ),
      );

      return true;
    },
    [pairs, setDraftPairs, setImportMessage, wordPairLimit],
  );
}
