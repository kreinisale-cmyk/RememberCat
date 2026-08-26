import { DeckSize, FocusMode, GameSession, MatchMode } from './types';

export const DEFAULT_GAME_SESSION: GameSession = {
  pairs: [],
  deckSize: DeckSize.Fifteen,
  focusMode: FocusMode.Timed,
  matchMode: MatchMode.Easy,
};

export const MISSING_GAME_SESSION_PROVIDER_ERROR =
  'useGameSession must be used inside a GameSessionProvider.';
export const SAVED_DECK_LIBRARY_ERROR_MESSAGE =
  'Saved decks are temporarily unavailable on this device.';
