import type { AudioPlayer, AudioStatus } from 'expo-audio';

import {
  AUDIO_CANCELLED_ERROR_NAME,
  AUDIO_CANCELLED_MESSAGE,
  AUDIO_LOG_PREFIX,
  AUDIO_PLAYBACK_POSITION_SECONDS,
  AUDIO_PLAYBACK_START_TIMEOUT_MS,
  AUDIO_REPLAY_PREPARATION_TIMEOUT_MS,
  AUDIO_STATUS_EVENT,
} from './constants';
import { AudioCueRequest, AudioPlaybackEvent, AudioPlaybackWait } from './types';

export function logAudioPlayback(event: AudioPlaybackEvent, filename: string, detail?: unknown) {
  if (__DEV__) {
    const message = detail instanceof Error ? detail.message : detail;
    console.info(AUDIO_LOG_PREFIX, JSON.stringify({ event, filename, detail: message }));
  }
}

export function assertAudioRequestActive(signal: AbortSignal) {
  if (signal.aborted) {
    const error = new Error(AUDIO_CANCELLED_MESSAGE);
    error.name = AUDIO_CANCELLED_ERROR_NAME;
    throw error;
  }
}

export function pauseAudioCue(player: AudioPlayer, filename: string) {
  try {
    player.pause();
  } catch (error) {
    logAudioPlayback(AudioPlaybackEvent.Error, filename, error);
  }
}

export async function prepareAudioCueForReplay(
  player: AudioPlayer,
  signal: AbortSignal,
  timeoutMs = AUDIO_REPLAY_PREPARATION_TIMEOUT_MS,
) {
  assertAudioRequestActive(signal);

  if (player.currentStatus.currentTime === AUDIO_PLAYBACK_POSITION_SECONDS) {
    return false;
  }

  player.pause();
  const readyController = new AbortController();
  const cancelReady = () => readyController.abort();
  signal.addEventListener('abort', cancelReady);
  const ready = waitForAudioPlayer(
    player,
    AudioPlaybackWait.Ready,
    timeoutMs,
    readyController.signal,
  );

  try {
    await player.seekTo(AUDIO_PLAYBACK_POSITION_SECONDS);
    assertAudioRequestActive(signal);
    await ready;
    assertAudioRequestActive(signal);
  } finally {
    readyController.abort();
    signal.removeEventListener('abort', cancelReady);
    await ready.catch(() => undefined);
  }

  return true;
}

export function waitForAudioPlayer(
  player: AudioPlayer,
  condition: AudioPlaybackWait,
  timeoutMs: number,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let subscription: ReturnType<AudioPlayer['addListener']> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let isSettled = false;

    function finish(error?: Error) {
      if (isSettled) {
        return;
      }

      isSettled = true;
      clearTimeout(timeout);
      subscription?.remove();
      signal.removeEventListener('abort', cancel);

      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }

    function cancel() {
      const error = new Error(AUDIO_CANCELLED_MESSAGE);
      error.name = AUDIO_CANCELLED_ERROR_NAME;
      finish(error);
    }

    function inspectStatus(status: AudioStatus) {
      if (status.error) {
        finish(new Error(status.error));
      } else if (condition === AudioPlaybackWait.Loaded && status.isLoaded) {
        finish();
      } else if (condition === AudioPlaybackWait.Ready && status.playbackState === 'ready') {
        finish();
      } else if (condition === AudioPlaybackWait.Playing && status.playing) {
        finish();
      }
    }

    if (signal.aborted) {
      cancel();
      return;
    }

    signal.addEventListener('abort', cancel);
    timeout = setTimeout(
      () => finish(new Error(`Audio ${condition} timeout after ${timeoutMs} ms`)),
      timeoutMs,
    );

    try {
      subscription = player.addListener(AUDIO_STATUS_EVENT, inspectStatus);
      inspectStatus(player.currentStatus);
    } catch (error) {
      finish(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

export async function playAudioCue({
  player,
  filename,
  signal,
  loadTimeoutMs,
  isPreparedForReplay = false,
}: AudioCueRequest) {
  assertAudioRequestActive(signal);
  logAudioPlayback(AudioPlaybackEvent.Loading, filename);
  await waitForAudioPlayer(player, AudioPlaybackWait.Loaded, loadTimeoutMs, signal);
  assertAudioRequestActive(signal);
  logAudioPlayback(AudioPlaybackEvent.Ready, filename);
  if (!isPreparedForReplay) {
    await prepareAudioCueForReplay(player, signal);
  }
  assertAudioRequestActive(signal);

  // Subscribe before play so even very short effects report their actual start.
  const startController = new AbortController();
  const cancelStart = () => startController.abort();
  signal.addEventListener('abort', cancelStart);
  const started = waitForAudioPlayer(
    player,
    AudioPlaybackWait.Playing,
    AUDIO_PLAYBACK_START_TIMEOUT_MS,
    startController.signal,
  );

  try {
    logAudioPlayback(AudioPlaybackEvent.Requested, filename);
    player.play();
    await started;
    assertAudioRequestActive(signal);
    logAudioPlayback(AudioPlaybackEvent.Playing, filename);
  } finally {
    startController.abort();
    signal.removeEventListener('abort', cancelStart);
    // Consume a rejected waiter if the native play call itself threw.
    await started.catch(() => undefined);
  }
}
