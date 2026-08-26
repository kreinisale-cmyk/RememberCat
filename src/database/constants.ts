import { DeckSize } from '@/features/GameSession/types';

export const SAVED_DECK_DATABASE_NAME = 'remember-cat.db';
export const SAVED_DECK_TABLE_NAME = 'saved_decks';
export const SUPPORTED_SAVED_DECK_SIZES: number[] = [DeckSize.Six, DeckSize.Ten, DeckSize.Fifteen];
