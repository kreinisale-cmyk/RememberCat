import { DeckSize, SavedDeck } from '@/features/GameSession/types';

export function findLatestSavedDeckForSize(savedDecks: SavedDeck[], deckSize: DeckSize) {
  return savedDecks.reduce<SavedDeck | null>((latestSavedDeck, savedDeck) => {
    if (savedDeck.pairCount !== deckSize) {
      return latestSavedDeck;
    }

    if (!latestSavedDeck || savedDeck.updatedAt > latestSavedDeck.updatedAt) {
      return savedDeck;
    }

    return latestSavedDeck;
  }, null);
}
