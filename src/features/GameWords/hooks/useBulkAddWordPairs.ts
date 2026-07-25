import { useCallback } from 'react';

import { WordPair } from '@/features/GameSession/types';

import { WORD_PAIR_LIMIT } from '../constants';
import { parseWordPairFile } from '../utils';

type UseBulkAddWordPairsOptions = {
  pairs: WordPair[];
  setDraftPairs: (pairs: WordPair[]) => void;
  setImportMessage: (message: string) => void;
};

export function useBulkAddWordPairs({
  pairs,
  setDraftPairs,
  setImportMessage,
}: UseBulkAddWordPairsOptions) {
  return useCallback(
    (contents: string) => {
      const availableSlots = WORD_PAIR_LIMIT - pairs.length;
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
    [pairs, setDraftPairs, setImportMessage],
  );
}
