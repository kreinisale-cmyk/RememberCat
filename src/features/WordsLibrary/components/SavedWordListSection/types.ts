import { SavedDeck } from '@/features/GameSession/types';

export type SavedWordListSectionProps = {
  savedDeck: SavedDeck;
  isSelected: boolean;
  onDelete: (savedDeckId: string) => void;
  onEdit: (savedDeckId: string) => void;
  onSelect: (savedDeckId: string) => void;
};
