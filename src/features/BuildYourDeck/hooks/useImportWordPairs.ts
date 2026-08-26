import { useCallback } from 'react';

import { WordPair } from '@/features/GameSession/types';

import { WORD_PAIR_FILE_TYPES } from '../constants';
import { parseWordPairFile } from '../utils';

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
      const pairsToAdd = importedPairs.slice(0, availableSlots);

      setDraftPairs([...pairsToAdd, ...pairs]);
      setImportMessage(
        pairsToAdd.length
          ? `Imported ${pairsToAdd.length} word pair${pairsToAdd.length === 1 ? '' : 's'}.`
          : 'No valid word - translation pairs found.',
      );
    } catch {
      setImportMessage('Rebuild the Android app once to enable local file importing.');
    }
  }, [pairs, setDraftPairs, setImportMessage, wordPairLimit]);
}
