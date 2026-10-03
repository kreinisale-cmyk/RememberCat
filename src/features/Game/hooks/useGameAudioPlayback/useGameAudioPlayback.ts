import { AudioPlayer } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { AUDIO_STATUS_EVENT } from './constants';
import {
  logAudioPlayback,
  pauseAudioCue,
  playAudioCue,
  prepareAudioCueForReplay,
} from './playback';
import { ActiveAudioCue, AudioCuePhase, AudioPlaybackEvent } from './types';
import { isMatchingAudioCue, shouldReportAudioCueCancellation } from './utils';
import { ANSWER_AUDIO_LOAD_TIMEOUT_MS } from '../useGameFeedback/constants';

export function useGameAudioPlayback(enabled: boolean) {
  const activeCueRef = useRef<ActiveAudioCue | null>(null);
  const nextRequestIdRef = useRef(0);
  const preparationControllersRef = useRef(new Map<AudioPlayer, AbortController>());
  const preparedPlayersRef = useRef(new Set<AudioPlayer>());
  const mountedRef = useRef(false);
  const focusedRef = useRef(false);

  const cancelPreparations = useCallback(() => {
    preparationControllersRef.current.forEach((controller) => controller.abort());
    preparationControllersRef.current.clear();
    preparedPlayersRef.current.clear();
  }, []);

  const cancelPlayback = useCallback(() => {
    const activeCue = activeCueRef.current;

    if (!activeCue) {
      return;
    }

    activeCueRef.current = null;
    activeCue.controller.abort();
    activeCue.removeStatusListener();

    if (mountedRef.current && shouldReportAudioCueCancellation(activeCue)) {
      if (activeCue.player.currentStatus.playing) {
        pauseAudioCue(activeCue.player, activeCue.filename);
      }

      logAudioPlayback(AudioPlaybackEvent.Cancelled, activeCue.filename);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cancelPreparations();
      const activeCue = activeCueRef.current;
      activeCueRef.current = null;
      activeCue?.controller.abort();
      activeCue?.removeStatusListener();
    };
  }, [cancelPreparations]);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;

      return () => {
        focusedRef.current = false;
        cancelPreparations();
        cancelPlayback();
      };
    }, [cancelPlayback, cancelPreparations]),
  );

  useEffect(() => {
    if (!enabled) {
      cancelPreparations();
      cancelPlayback();
    }
  }, [cancelPlayback, cancelPreparations, enabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        cancelPreparations();
        cancelPlayback();
      }
    });

    return () => subscription.remove();
  }, [cancelPlayback, cancelPreparations]);

  const playAnswer = useCallback(
    (player: AudioPlayer, filename: string) => {
      if (
        !enabled ||
        !mountedRef.current ||
        !focusedRef.current ||
        AppState.currentState !== 'active'
      ) {
        return;
      }

      cancelPlayback();
      const isPreparedForReplay = preparedPlayersRef.current.delete(player);
      preparationControllersRef.current.get(player)?.abort();
      preparationControllersRef.current.delete(player);
      const controller = new AbortController();
      nextRequestIdRef.current += 1;
      const activeCue: ActiveAudioCue = {
        controller,
        filename,
        phase: AudioCuePhase.Pending,
        player,
        removeStatusListener: () => undefined,
        requestId: nextRequestIdRef.current,
      };
      activeCueRef.current = activeCue;

      const statusSubscription = player.addListener(AUDIO_STATUS_EVENT, (status) => {
        if (!isMatchingAudioCue(activeCueRef.current, activeCue)) {
          return;
        }

        if (status.error) {
          activeCueRef.current = null;
          activeCue.controller.abort();
          activeCue.removeStatusListener();
          logAudioPlayback(AudioPlaybackEvent.Error, filename, status.error);
        } else if (status.didJustFinish) {
          activeCueRef.current = null;
          activeCue.controller.abort();
          activeCue.removeStatusListener();
          logAudioPlayback(AudioPlaybackEvent.Finished, filename);

          preparationControllersRef.current.get(player)?.abort();
          const preparationController = new AbortController();
          preparationControllersRef.current.set(player, preparationController);

          void prepareAudioCueForReplay(player, preparationController.signal)
            .then((didPrepare) => {
              if (
                didPrepare &&
                !preparationController.signal.aborted &&
                mountedRef.current &&
                activeCueRef.current?.player !== player
              ) {
                preparedPlayersRef.current.add(player);
                logAudioPlayback(AudioPlaybackEvent.Prepared, filename);
              }
            })
            .catch((error) => {
              if (!preparationController.signal.aborted && mountedRef.current) {
                logAudioPlayback(AudioPlaybackEvent.Error, filename, error);
              }
            })
            .finally(() => {
              if (preparationControllersRef.current.get(player) === preparationController) {
                preparationControllersRef.current.delete(player);
              }
            });
        }
      });
      activeCue.removeStatusListener = () => statusSubscription.remove();
      logAudioPlayback(AudioPlaybackEvent.Selected, filename);

      void playAudioCue({
        player,
        filename,
        signal: controller.signal,
        loadTimeoutMs: ANSWER_AUDIO_LOAD_TIMEOUT_MS,
        isPreparedForReplay,
      })
        .then(() => {
          if (isMatchingAudioCue(activeCueRef.current, activeCue)) {
            activeCue.phase = AudioCuePhase.Playing;
          }
        })
        .catch((error) => {
          if (
            !controller.signal.aborted &&
            mountedRef.current &&
            isMatchingAudioCue(activeCueRef.current, activeCue)
          ) {
            activeCueRef.current = null;
            activeCue.removeStatusListener();
            logAudioPlayback(AudioPlaybackEvent.Error, filename, error);
          }
        });
    },
    [cancelPlayback, enabled],
  );

  return playAnswer;
}
