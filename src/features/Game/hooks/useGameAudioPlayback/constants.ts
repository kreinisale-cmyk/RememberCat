export const AUDIO_STATUS_EVENT = 'playbackStatusUpdate';
export const AUDIO_PLAYBACK_START_TIMEOUT_MS = 500;
export const AUDIO_REPLAY_PREPARATION_TIMEOUT_MS = 1000;
export const AUDIO_PLAYBACK_POSITION_SECONDS = 0;
export const AUDIO_CANCELLED_ERROR_NAME = 'AbortError';
export const AUDIO_CANCELLED_MESSAGE = 'Audio request cancelled';
export const AUDIO_LOG_PREFIX = '[GameAudio]';
export const GAME_AUDIO_MODE = {
  interruptionMode: 'mixWithOthers',
  playsInSilentMode: false,
  shouldPlayInBackground: false,
} as const;
