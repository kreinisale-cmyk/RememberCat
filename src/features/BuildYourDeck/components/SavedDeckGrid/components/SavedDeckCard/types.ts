import { SavedDeck } from '@/features/GameSession/types';

export type SavedDeckCardProps = {
  savedDeck: SavedDeck;
  isSelected: boolean;
  onSelect: (savedDeckId: string) => void;
  onEdit: (savedDeckId: string) => void;
  onDelete: (savedDeckId: string) => Promise<boolean>;
};
