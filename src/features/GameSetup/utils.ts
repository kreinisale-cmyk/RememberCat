import { DeckSize, FocusMode, MatchMode, SavedDeck } from '@/features/GameSession/types';

export function getFocusModeDescription(mode: FocusMode) {
  return mode === FocusMode.Timed ? 'One minute for each challenge stage' : 'No challenge clock';
}

export function getMatchModeDescription(mode: MatchMode) {
  return mode === MatchMode.Easy
    ? 'Practice every word five times, then shuffle translations only'
    : 'Skip easy practice and shuffle both columns after every match';
}

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
