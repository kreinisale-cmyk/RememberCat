import { FocusMode, GameSession, MatchMode } from './types';

export const DEFAULT_GAME_SESSION: GameSession = {
  pairs: [],
  focusMode: FocusMode.Timed,
  matchMode: MatchMode.Easy,
};

export const MISSING_GAME_SESSION_PROVIDER_ERROR =
  'useGameSession must be used inside a GameSessionProvider.';
