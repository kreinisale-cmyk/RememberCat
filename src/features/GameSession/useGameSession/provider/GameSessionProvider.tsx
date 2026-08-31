import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { GameSession } from '../../types';
import { cloneWordPairs, createInitialGameSession, isCompleteWordPair } from '../../utils';
import { GameSessionContext } from '../context/GameSessionContext';
import { useSavedDeckLibrary } from '../hooks/useSavedDeckLibrary';
import { useWordStatisticsLibrary } from '../hooks/useWordStatisticsLibrary';

export function GameSessionProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState(createInitialGameSession);
  const [session, setSession] = useState<GameSession | null>(null);
  const { savedDecks, isSavedDeckLibraryLoading, savedDeckLibraryError, saveDeck, removeDeck } =
    useSavedDeckLibrary();
  const {
    wordStatistics,
    isWordStatisticsLoading,
    wordStatisticsError,
    refreshWordStatistics,
    saveCompletedGameStatistics,
  } = useWordStatisticsLibrary();

  const updateDraft = useCallback((update: Partial<GameSession>) => {
    setDraft((currentDraft) => ({ ...currentDraft, ...update }));
  }, []);

  const reuseSavedDeck = useCallback(
    (savedDeckId: string) => {
      const selectedSavedDeck = savedDecks.find((savedDeck) => savedDeck.id === savedDeckId);

      if (!selectedSavedDeck) {
        return false;
      }

      setDraft((currentDraft) => ({
        ...currentDraft,
        deckSize: selectedSavedDeck.pairCount,
        pairs: cloneWordPairs(selectedSavedDeck.pairs),
        savedDeckId: selectedSavedDeck.id,
      }));

      return true;
    },
    [savedDecks],
  );

  const startSavedDeckGame = useCallback(
    (savedDeckId: string) => {
      const selectedSavedDeck = savedDecks.find((savedDeck) => savedDeck.id === savedDeckId);

      if (!selectedSavedDeck) {
        return false;
      }

      const sessionPairs = cloneWordPairs(selectedSavedDeck.pairs);
      const selectedSession = {
        ...draft,
        deckSize: selectedSavedDeck.pairCount,
        pairs: sessionPairs,
        savedDeckId: selectedSavedDeck.id,
      };

      setDraft(selectedSession);
      setSession(selectedSession);

      return true;
    },
    [draft, savedDecks],
  );

  const startGameSession = useCallback(
    async (savedDeckId?: string) => {
      const sessionPairs = cloneWordPairs(draft.pairs);
      const isCompleteDeck =
        sessionPairs.length === draft.deckSize && sessionPairs.every(isCompleteWordPair);

      if (isCompleteDeck) {
        const persistedSavedDeckId = await saveDeck(sessionPairs, savedDeckId);

        await refreshWordStatistics();

        setSession({
          ...draft,
          pairs: sessionPairs,
          savedDeckId: persistedSavedDeckId,
        });

        return;
      }

      setSession({ ...draft, pairs: sessionPairs });
    },
    [draft, refreshWordStatistics, saveDeck],
  );

  const removeSavedDeck = useCallback(
    async (savedDeckId: string) => {
      const wasRemoved = await removeDeck(savedDeckId);

      if (wasRemoved) {
        await refreshWordStatistics();
      }

      return wasRemoved;
    },
    [refreshWordStatistics, removeDeck],
  );

  const value = useMemo(
    () => ({
      draft,
      session,
      savedDecks,
      isSavedDeckLibraryLoading,
      savedDeckLibraryError,
      wordStatistics,
      isWordStatisticsLoading,
      wordStatisticsError,
      updateDraft,
      reuseSavedDeck,
      removeSavedDeck,
      startSavedDeckGame,
      startGameSession,
      saveCompletedGameStatistics,
    }),
    [
      draft,
      isSavedDeckLibraryLoading,
      isWordStatisticsLoading,
      savedDeckLibraryError,
      reuseSavedDeck,
      removeSavedDeck,
      savedDecks,
      saveCompletedGameStatistics,
      session,
      startSavedDeckGame,
      startGameSession,
      updateDraft,
      wordStatistics,
      wordStatisticsError,
    ],
  );

  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}
