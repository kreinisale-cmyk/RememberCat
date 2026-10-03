import type { AudioPlayer } from 'expo-audio';

export enum AudioPlaybackEvent {
  Selected = 'selected',
  Loading = 'loading',
  Ready = 'ready',
  Requested = 'requested',
  Playing = 'playing',
  Finished = 'finished',
  Prepared = 'prepared',
  Cancelled = 'cancelled',
  Fallback = 'fallback',
  Error = 'error',
}

export enum AudioCuePhase {
  Pending = 'pending',
  Playing = 'playing',
}

export enum AudioPlaybackWait {
  Loaded = 'loaded',
  Ready = 'ready',
  Playing = 'playing',
}

export type AudioCueRequest = {
  player: AudioPlayer;
  filename: string;
  signal: AbortSignal;
  loadTimeoutMs: number;
  isPreparedForReplay?: boolean;
};

export type ActiveAudioCue = {
  controller: AbortController;
  filename: string;
  phase: AudioCuePhase;
  player: AudioPlayer;
  removeStatusListener: () => void;
  requestId: number;
};
