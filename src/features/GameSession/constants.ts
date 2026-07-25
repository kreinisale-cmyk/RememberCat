import { FocusMode, GameSession, MatchMode } from './types';

export const DEFAULT_GAME_SESSION: GameSession = {
  pairs: [],
  focusMode: FocusMode.Timed,
  matchMode: MatchMode.Easy,
};
