import { SavedDeck } from '@/features/GameSession/types';

export function createSavedDeckAccessibilityLabel(savedDeck: SavedDeck) {
  return `Open ${savedDeck.name}, ${savedDeck.pairCount} words`;
}

export function createSavedDeckPreview(savedDeck: SavedDeck) {
  return savedDeck.pairs
    .slice(0, 3)
    .map((pair) => `${pair.word} – ${pair.translation}`)
    .join('\n');
}
