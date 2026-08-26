import { DeckSize } from '@/features/GameSession/types';

import { DECK_SIZE_ACCESSIBILITY_LABEL_SUFFIX } from './constants';

export function isSelectedDeckSize(deckSize: DeckSize, selectedDeckSize: DeckSize) {
  return deckSize === selectedDeckSize;
}

export function createDeckSizeAccessibilityLabel(deckSize: DeckSize) {
  return `${deckSize} ${DECK_SIZE_ACCESSIBILITY_LABEL_SUFFIX}`;
}
