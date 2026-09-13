import { GameOutcomeFeedback } from './types';

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
