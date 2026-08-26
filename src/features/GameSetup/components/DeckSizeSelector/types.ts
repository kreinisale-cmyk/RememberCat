import { DeckSize } from '@/features/GameSession/types';

export type DeckSizeSelectorProps = {
  selectedDeckSize: DeckSize;
  onChange: (deckSize: DeckSize) => void;
};
