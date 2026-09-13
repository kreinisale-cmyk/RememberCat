import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import {
  GameSession,
  SavedDeckPersistenceStatus,
  StartGameSessionOptions,
  StartGameSessionStatus,
} from '../../types';
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
    wordMasteries,
    refreshWordStatistics,
    saveAssessmentStatistics,
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
    async ({ deckName, savedDeckId }: StartGameSessionOptions) => {
      const sessionPairs = cloneWordPairs(draft.pairs);
      const isCompleteDeck =
        sessionPairs.length === draft.deckSize && sessionPairs.every(isCompleteWordPair);

      if (!isCompleteDeck || !deckName.trim()) {
        return { status: StartGameSessionStatus.InvalidDeck, savedDeckId: null };
      }

      const persistenceResult = await saveDeck({
        name: deckName,
        pairs: sessionPairs,
        savedDeckId,
      });

      if (persistenceResult.status === SavedDeckPersistenceStatus.DuplicateDeck) {
        return { status: StartGameSessionStatus.DuplicateDeck, savedDeckId: null };
      } else if (
        persistenceResult.status !== SavedDeckPersistenceStatus.Saved ||
        !persistenceResult.savedDeckId
      ) {
        return { status: StartGameSessionStatus.SaveFailed, savedDeckId: null };
      }

      await refreshWordStatistics();

      setSession({
        ...draft,
        pairs: sessionPairs,
        savedDeckId: persistenceResult.savedDeckId,
      });

      return {
        status: StartGameSessionStatus.Started,
        savedDeckId: persistenceResult.savedDeckId,
      };
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
      wordMasteries,
      isWordStatisticsLoading,
      wordStatisticsError,
      updateDraft,
      reuseSavedDeck,
      removeSavedDeck,
      startSavedDeckGame,
      startGameSession,
      saveAssessmentStatistics,
    }),
    [
      draft,
      isSavedDeckLibraryLoading,
      isWordStatisticsLoading,
      savedDeckLibraryError,
      reuseSavedDeck,
      removeSavedDeck,
      savedDecks,
      saveAssessmentStatistics,
      session,
      startSavedDeckGame,
      startGameSession,
      updateDraft,
      wordStatistics,
      wordMasteries,
      wordStatisticsError,
    ],
  );

  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}
