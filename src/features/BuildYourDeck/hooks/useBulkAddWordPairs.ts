import { useCallback } from 'react';

import { WordPair } from '@/features/GameSession/types';

import { parseWordPairFile } from '../utils';

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
      const pairsToAdd = parseWordPairFile(contents).slice(0, availableSlots);

      if (!pairsToAdd.length) {
        setImportMessage('No valid word - translation pairs found.');

        return false;
      }

      setDraftPairs([...pairsToAdd, ...pairs]);
      setImportMessage(
        `Added ${pairsToAdd.length} word pair${pairsToAdd.length === 1 ? '' : 's'}.`,
      );

      return true;
    },
    [pairs, setDraftPairs, setImportMessage, wordPairLimit],
  );
}
