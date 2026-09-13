import { SavedDeck } from '@/features/GameSession/types';
import { WordMasteryLookup, WordStatisticLookup } from '../../types';

export type WordStatisticsDeckCardProps = {
  savedDeck: SavedDeck;
  statisticLookup: WordStatisticLookup;
  masteryLookup: WordMasteryLookup;
};
