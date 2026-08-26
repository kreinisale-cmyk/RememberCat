import { useCallback, useEffect, useState } from 'react';

import { deleteSavedDeck, loadSavedDecks, persistSavedDeck } from '@/database/savedDecks';

import { SAVED_DECK_LIBRARY_ERROR_MESSAGE } from '../../constants';
import { SavedDeck, WordPair } from '../../types';

export function useSavedDeckLibrary() {
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>([]);
  const [isSavedDeckLibraryLoading, setIsSavedDeckLibraryLoading] = useState(true);
  const [savedDeckLibraryError, setSavedDeckLibraryError] = useState<string | null>(null);

  const refreshSavedDecks = useCallback(async () => {
    const storedDecks = await loadSavedDecks();

    setSavedDecks(storedDecks);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeSavedDeckLibrary() {
      try {
        const storedDecks = await loadSavedDecks();

        if (isMounted) {
          setSavedDecks(storedDecks);
        }
      } catch {
        if (isMounted) {
          setSavedDeckLibraryError(SAVED_DECK_LIBRARY_ERROR_MESSAGE);
        }
      } finally {
        if (isMounted) {
          setIsSavedDeckLibraryLoading(false);
        }
      }
    }

    void initializeSavedDeckLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveDeck = useCallback(
    async (pairs: WordPair[], savedDeckId?: string) => {
      try {
        await persistSavedDeck(pairs, savedDeckId);
        await refreshSavedDecks();
        setSavedDeckLibraryError(null);

        return true;
      } catch {
        setSavedDeckLibraryError(SAVED_DECK_LIBRARY_ERROR_MESSAGE);

        return false;
      }
    },
    [refreshSavedDecks],
  );

  const removeDeck = useCallback(
    async (savedDeckId: string) => {
      try {
        await deleteSavedDeck(savedDeckId);
        await refreshSavedDecks();
        setSavedDeckLibraryError(null);

        return true;
      } catch {
        setSavedDeckLibraryError(SAVED_DECK_LIBRARY_ERROR_MESSAGE);

        return false;
      }
    },
    [refreshSavedDecks],
  );

  return {
    savedDecks,
    isSavedDeckLibraryLoading,
    savedDeckLibraryError,
    saveDeck,
    removeDeck,
  };
}
