import { SavedDeck } from '@/features/GameSession/types';

export function createSavedDeckAccessibilityLabel(savedDeck: SavedDeck) {
  return `Select ${savedDeck.name}, ${savedDeck.pairCount} words`;
}

export function createEditSavedDeckAccessibilityLabel(savedDeckName: string) {
  return `Edit ${savedDeckName}`;
}

export function createDeleteSavedDeckAccessibilityLabel(savedDeckName: string) {
  return `Delete ${savedDeckName}`;
}

export function createSavedDeckPreview(savedDeck: SavedDeck) {
  return savedDeck.pairs
    .slice(0, 3)
    .map((pair) => `${pair.word} – ${pair.translation}`)
    .join('\n');
}
