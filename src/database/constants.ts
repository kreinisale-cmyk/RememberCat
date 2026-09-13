import { DeckSize } from '@/features/GameSession/types';

export const SAVED_DECK_DATABASE_NAME = 'remember-cat.db';
export const SAVED_DECK_TABLE_NAME = 'saved_decks';
export const WORD_STATISTICS_TABLE_NAME = 'word_statistics';
export const WORD_MASTERY_TABLE_NAME = 'word_mastery';
export const SAVED_DECK_DATABASE_VERSION = 2;
export const SUPPORTED_SAVED_DECK_SIZES: number[] = [DeckSize.Six, DeckSize.Ten, DeckSize.Fifteen];
