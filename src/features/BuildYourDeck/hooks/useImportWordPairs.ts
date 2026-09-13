import { useCallback } from 'react';

import { WordPair } from '@/features/GameSession/types';

import { WORD_PAIR_FILE_TYPES } from '../constants';
import { WordPairAdditionSource } from '../types';
import { createWordPairAdditionMessage, parseWordPairFile, selectUniqueWordPairs } from '../utils';

type UseImportWordPairsOptions = {
  pairs: WordPair[];
  wordPairLimit: number;
  setDraftPairs: (pairs: WordPair[]) => void;
  setImportMessage: (message: string) => void;
};

export function useImportWordPairs({
  pairs,
  wordPairLimit,
  setDraftPairs,
  setImportMessage,
}: UseImportWordPairsOptions) {
  return useCallback(async () => {
    try {
      const DocumentPicker = await import('expo-document-picker');
      const { File } = await import('expo-file-system');
      const result = await DocumentPicker.getDocumentAsync({
        type: WORD_PAIR_FILE_TYPES,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = new File(result.assets[0].uri);
      const importedPairs = parseWordPairFile(await file.text());
      const availableSlots = wordPairLimit - pairs.length;
      const { acceptedPairs, skippedPairCount } = selectUniqueWordPairs(
        pairs,
        importedPairs,
        availableSlots,
      );

      setDraftPairs([...acceptedPairs, ...pairs]);
      setImportMessage(
        createWordPairAdditionMessage(
          WordPairAdditionSource.Import,
          acceptedPairs.length,
          skippedPairCount,
        ),
      );
    } catch {
      setImportMessage('Rebuild the Android app once to enable local file importing.');
    }
  }, [pairs, setDraftPairs, setImportMessage, wordPairLimit]);
}
