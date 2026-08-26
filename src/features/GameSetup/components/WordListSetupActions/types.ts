import { DeckSize, SavedDeck } from '@/features/GameSession/types';

export type WordListSetupActionsProps = {
  deckSize: DeckSize;
  latestSavedDeck: SavedDeck | null;
  isLoading: boolean;
  errorMessage: string | null;
  onAdd: () => void;
  onContinue: () => void;
  onEdit: () => void;
};
