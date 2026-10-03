import { GameOutcomeFeedback } from './types';

export const ANSWER_AUDIO_LOAD_TIMEOUT_MS = 250;
export const ANSWER_AUDIO_PLAYER_OPTIONS = { downloadFirst: true, updateInterval: 40 } as const;
export const SUCCESS_AUDIO_FILENAMES = [
  'app-button-success-cool.wav',
  'app-button-success.wav',
  'clean-game-success.wav',
] as const;
export const FAILURE_AUDIO_FILENAMES = [
  'small-fail-knock.wav',
  'soft-fail-click.wav',
  'soft-mismatch-fail.wav',
] as const;

export const MATCH_SUCCESS_AUDIO_SOURCES = [
  require('../../../../assets/music/app-button-success-cool.wav'),
  require('../../../../assets/music/app-button-success.wav'),
  require('../../../../assets/music/clean-game-success.wav'),
] as const;

export const MATCH_FAILURE_AUDIO_SOURCES = [
  require('../../../../assets/music/small-fail-knock.wav'),
  require('../../../../assets/music/soft-fail-click.wav'),
  require('../../../../assets/music/soft-mismatch-fail.wav'),
] as const;

export const GAME_OUTCOME_ANNOUNCEMENTS: Record<GameOutcomeFeedback, string> = {
  [GameOutcomeFeedback.Correct]: 'Correct',
  [GameOutcomeFeedback.Incorrect]: 'Try again',
  [GameOutcomeFeedback.ChallengeFailed]: 'Challenge ended',
  [GameOutcomeFeedback.SessionComplete]: 'Round complete',
};

export const PREPARATION_WORD_LEARNED_ANNOUNCEMENT = 'Word learned';
