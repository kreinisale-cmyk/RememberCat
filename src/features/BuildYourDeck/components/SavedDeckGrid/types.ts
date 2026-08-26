import { SavedDeck } from '@/features/GameSession/types';

export type SavedDeckGridProps = {
  savedDecks: SavedDeck[];
  isLoading: boolean;
  errorMessage: string | null;
  selectedSavedDeckId: string | null;
  onSelect: (savedDeckId: string) => void;
  onEdit: (savedDeckId: string) => void;
  onDelete: (savedDeckId: string) => Promise<boolean>;
  onCreate: () => void;
};
