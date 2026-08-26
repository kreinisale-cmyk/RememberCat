import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { GameSession } from '../../types';
import { cloneWordPairs, createInitialGameSession, isCompleteWordPair } from '../../utils';
import { GameSessionContext } from '../context/GameSessionContext';
import { useSavedDeckLibrary } from '../hooks/useSavedDeckLibrary';

export function GameSessionProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState(createInitialGameSession);
  const [session, setSession] = useState<GameSession | null>(null);
  const { savedDecks, isSavedDeckLibraryLoading, savedDeckLibraryError, saveDeck, removeDeck } =
    useSavedDeckLibrary();

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
        await saveDeck(sessionPairs, savedDeckId);
      }

      setSession({ ...draft, pairs: sessionPairs });
    },
    [draft, saveDeck],
  );

  const value = useMemo(
    () => ({
      draft,
      session,
      savedDecks,
      isSavedDeckLibraryLoading,
      savedDeckLibraryError,
      updateDraft,
      reuseSavedDeck,
      removeSavedDeck: removeDeck,
      startSavedDeckGame,
      startGameSession,
    }),
    [
      draft,
      isSavedDeckLibraryLoading,
      savedDeckLibraryError,
      reuseSavedDeck,
      removeDeck,
      savedDecks,
      session,
      startSavedDeckGame,
      startGameSession,
      updateDraft,
    ],
  );

  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}
