import { useCallback, useEffect, useState } from 'react';

import {
  deleteSavedDeck,
  DuplicateSavedDeckError,
  loadSavedDecks,
  persistSavedDeck,
} from '@/database/savedDecks';

import {
  DUPLICATE_SAVED_DECK_ERROR_MESSAGE,
  SAVED_DECK_LIBRARY_ERROR_MESSAGE,
} from '../../constants';
import { SavedDeck, SavedDeckPersistenceStatus, SaveDeckOptions } from '../../types';

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
    async ({ name, pairs, savedDeckId }: SaveDeckOptions) => {
      try {
        const persistedSavedDeckId = await persistSavedDeck(name, pairs, savedDeckId);
        await refreshSavedDecks();
        setSavedDeckLibraryError(null);

        return {
          status: SavedDeckPersistenceStatus.Saved,
          savedDeckId: persistedSavedDeckId,
        };
      } catch (error) {
        if (error instanceof DuplicateSavedDeckError) {
          setSavedDeckLibraryError(DUPLICATE_SAVED_DECK_ERROR_MESSAGE);

          return {
            status: SavedDeckPersistenceStatus.DuplicateDeck,
            savedDeckId: null,
          };
        }

        setSavedDeckLibraryError(SAVED_DECK_LIBRARY_ERROR_MESSAGE);

        return {
          status: SavedDeckPersistenceStatus.Failed,
          savedDeckId: null,
        };
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
