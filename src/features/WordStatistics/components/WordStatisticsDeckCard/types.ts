import { SavedDeck } from '@/features/GameSession/types';
import { WordStatisticLookup } from '../../types';

export type WordStatisticsDeckCardProps = {
  savedDeck: SavedDeck;
  statisticLookup: WordStatisticLookup;
};
