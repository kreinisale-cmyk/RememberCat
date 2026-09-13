import { DeckSize, FocusMode, GameSession, MatchMode } from './types';

export const DEFAULT_GAME_SESSION: GameSession = {
  pairs: [],
  deckSize: DeckSize.Fifteen,
  focusMode: FocusMode.Timed,
  matchMode: MatchMode.Easy,
  savedDeckId: null,
};

export const MISSING_GAME_SESSION_PROVIDER_ERROR =
  'useGameSession must be used inside a GameSessionProvider.';
export const SAVED_DECK_LIBRARY_ERROR_MESSAGE =
  'Saved decks are temporarily unavailable on this device.';
export const DUPLICATE_SAVED_DECK_ERROR_MESSAGE =
  'A word list with these exact pairs already exists.';
export const WORD_STATISTICS_ERROR_MESSAGE =
  'Word statistics are temporarily unavailable on this device.';
