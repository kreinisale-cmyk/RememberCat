import { useCallback } from 'react';

import { WordPair } from '@/features/GameSession/types';

import { BulkPasteAnalysis, BulkWordPairAdditionResult } from '../types';
import { createBulkWordPairAdditionMessage, createWordPair } from '../utils';

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
    (analysis: BulkPasteAnalysis): BulkWordPairAdditionResult => {
      const addedPairs = analysis.acceptedCandidates.map((candidate) =>
        createWordPair(candidate.word, candidate.translation),
      );

      if (!addedPairs.length) {
        return { addedPairCount: 0, remainingContents: analysis.remainingContents };
      }

      setDraftPairs([...addedPairs, ...pairs]);
      setImportMessage(
        createBulkWordPairAdditionMessage(
          addedPairs.length,
          analysis.lineResults.length - addedPairs.length,
        ),
      );

      return {
        addedPairCount: addedPairs.length,
        remainingContents: analysis.remainingContents,
      };
    },
    [pairs, setDraftPairs, setImportMessage],
  );
}
