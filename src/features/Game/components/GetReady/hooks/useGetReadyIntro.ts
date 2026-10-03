import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, AppState, AppStateStatus } from 'react-native';
import {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppPreferences } from '@/features/AppPreferences/useAppPreferences/useAppPreferences';

import {
  GET_READY_AUDIO_SOURCE,
  GET_READY_AUDIO_LOAD_TIMEOUT_MS,
  GET_READY_AUDIO_FILENAME,
  GET_READY_AUDIO_UPDATE_INTERVAL_MS,
  GET_READY_BOUNCE_END_PROGRESS,
  GET_READY_BOUNCE_PEAK_PROGRESS,
  GET_READY_BOUNCE_START_PROGRESS,
  GET_READY_DURATION_MS,
  GET_READY_ENTRANCE_END_PROGRESS,
  GET_READY_FADE_START_PROGRESS,
} from '../constants';
import { clampIntroProgress } from '../utils';
import { GetReadyPlaybackMode } from '../types';
import { GAME_AUDIO_MODE } from '../../../hooks/useGameAudioPlayback/constants';
import {
  assertAudioRequestActive,
  logAudioPlayback,
  pauseAudioCue,
  playAudioCue,
} from '../../../hooks/useGameAudioPlayback/playback';
import { AudioPlaybackEvent } from '../../../hooks/useGameAudioPlayback/types';

export function useGetReadyIntro(onComplete: () => void) {
  const { isPreferencesLoading, preferences } = useAppPreferences();
  const player = useAudioPlayer(GET_READY_AUDIO_SOURCE, {
    downloadFirst: true,
    updateInterval: GET_READY_AUDIO_UPDATE_INTERVAL_MS,
  });
  const playerStatus = useAudioPlayerStatus(player);
  const progress = useSharedValue(0);
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackModeRef = useRef(GetReadyPlaybackMode.Idle);
  const playbackRequestRef = useRef<AbortController | null>(null);
  const currentProgressRef = useRef(0);
  const timelineStartProgressRef = useRef(0);
  const timelineStartTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const shouldResumeSilentlyRef = useRef(false);
  const isMountedRef = useRef(true);

  const clearPendingTimeouts = useCallback(() => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  const completeIntro = useCallback(() => {
    if (!isMountedRef.current || hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    playbackRequestRef.current?.abort();
    clearPendingTimeouts();
    pauseAudioCue(player, GET_READY_AUDIO_FILENAME);
    progress.value = 1;
    onComplete();
  }, [clearPendingTimeouts, onComplete, player, progress]);

  const startVisualTimeline = useCallback(
    (startingProgress: number) => {
      if (!isMountedRef.current || hasCompletedRef.current) {
        return;
      }

      clearPendingTimeouts();
      const nextProgress = clampIntroProgress(startingProgress);
      const remainingDuration = Math.round(GET_READY_DURATION_MS * (1 - nextProgress));

      currentProgressRef.current = nextProgress;
      timelineStartProgressRef.current = nextProgress;
      timelineStartTimeRef.current = Date.now();
      progress.value = nextProgress;

      if (remainingDuration <= 0) {
        completeIntro();

        return;
      }

      progress.value = withTiming(1, { duration: remainingDuration, easing: Easing.linear });
      completionTimeoutRef.current = setTimeout(completeIntro, remainingDuration);
    },
    [clearPendingTimeouts, completeIntro, progress],
  );

  const captureVisualProgress = useCallback(() => {
    if (timelineStartTimeRef.current === null) {
      return currentProgressRef.current;
    }

    const elapsedProgress = (Date.now() - timelineStartTimeRef.current) / GET_READY_DURATION_MS;
    const nextProgress = clampIntroProgress(timelineStartProgressRef.current + elapsedProgress);

    currentProgressRef.current = nextProgress;

    return nextProgress;
  }, []);

  const startAudioPlayback = useCallback(async () => {
    playbackRequestRef.current?.abort();
    const controller = new AbortController();
    playbackRequestRef.current = controller;

    playbackModeRef.current = GetReadyPlaybackMode.Audio;
    try {
      assertAudioRequestActive(controller.signal);
      await setAudioModeAsync(GAME_AUDIO_MODE);
      assertAudioRequestActive(controller.signal);
      await playAudioCue({
        player,
        filename: GET_READY_AUDIO_FILENAME,
        signal: controller.signal,
        loadTimeoutMs: GET_READY_AUDIO_LOAD_TIMEOUT_MS,
      });
    } catch (error) {
      if (isMountedRef.current && !controller.signal.aborted) {
        controller.abort();
        logAudioPlayback(AudioPlaybackEvent.Fallback, GET_READY_AUDIO_FILENAME, error);
        pauseAudioCue(player, GET_READY_AUDIO_FILENAME);
        playbackModeRef.current = GetReadyPlaybackMode.Silent;
      }
    }
  }, [player]);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setIsReducedMotionEnabled);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReducedMotionEnabled,
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (playbackModeRef.current !== GetReadyPlaybackMode.Audio) {
      return;
    }

    if (playerStatus.error) {
      playbackRequestRef.current?.abort();
      logAudioPlayback(AudioPlaybackEvent.Fallback, GET_READY_AUDIO_FILENAME, playerStatus.error);
      pauseAudioCue(player, GET_READY_AUDIO_FILENAME);
      playbackModeRef.current = GetReadyPlaybackMode.Silent;

      return;
    }

    if (playerStatus.didJustFinish) {
      logAudioPlayback(AudioPlaybackEvent.Finished, GET_READY_AUDIO_FILENAME);
      playbackModeRef.current = GetReadyPlaybackMode.Silent;
    }
  }, [player, playerStatus.didJustFinish, playerStatus.error]);

  useEffect(() => {
    if (isPreferencesLoading || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    if (AppState.currentState !== 'active') {
      shouldResumeSilentlyRef.current = true;

      return;
    }

    startVisualTimeline(0);

    if (preferences.gameCuesEnabled) {
      void startAudioPlayback();
    } else {
      playbackModeRef.current = GetReadyPlaybackMode.Silent;
    }
  }, [isPreferencesLoading, preferences.gameCuesEnabled, startAudioPlayback, startVisualTimeline]);

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (!hasStartedRef.current || hasCompletedRef.current) {
        return;
      }

      if (nextAppState !== 'active') {
        const pausedProgress = captureVisualProgress();

        currentProgressRef.current = pausedProgress;
        shouldResumeSilentlyRef.current = true;
        playbackRequestRef.current?.abort();
        clearPendingTimeouts();
        pauseAudioCue(player, GET_READY_AUDIO_FILENAME);
        cancelAnimation(progress);
        progress.value = pausedProgress;
        timelineStartTimeRef.current = null;
        playbackModeRef.current = GetReadyPlaybackMode.Idle;

        return;
      }

      if (shouldResumeSilentlyRef.current) {
        shouldResumeSilentlyRef.current = false;
        playbackModeRef.current = GetReadyPlaybackMode.Silent;
        startVisualTimeline(currentProgressRef.current);
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, [captureVisualProgress, clearPendingTimeouts, player, progress, startVisualTimeline]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      playbackRequestRef.current?.abort();
      clearPendingTimeouts();
      cancelAnimation(progress);
    };
  }, [clearPendingTimeouts, player, progress]);

  useFocusEffect(
    useCallback(() => {
      if (shouldResumeSilentlyRef.current && AppState.currentState === 'active') {
        shouldResumeSilentlyRef.current = false;
        playbackModeRef.current = GetReadyPlaybackMode.Silent;
        startVisualTimeline(currentProgressRef.current);
      }

      return () => {
        playbackRequestRef.current?.abort();
        clearPendingTimeouts();
        cancelAnimation(progress);

        if (isMountedRef.current && !hasCompletedRef.current) {
          currentProgressRef.current = captureVisualProgress();
          timelineStartTimeRef.current = null;
          shouldResumeSilentlyRef.current = true;
          playbackModeRef.current = GetReadyPlaybackMode.Idle;
          pauseAudioCue(player, GET_READY_AUDIO_FILENAME);
        }
      };
    }, [captureVisualProgress, clearPendingTimeouts, player, progress, startVisualTimeline]),
  );

  useEffect(() => {
    if (!preferences.gameCuesEnabled && playbackModeRef.current === GetReadyPlaybackMode.Audio) {
      playbackRequestRef.current?.abort();
      pauseAudioCue(player, GET_READY_AUDIO_FILENAME);
      logAudioPlayback(
        AudioPlaybackEvent.Cancelled,
        GET_READY_AUDIO_FILENAME,
        'game-cues-disabled',
      );
      playbackModeRef.current = GetReadyPlaybackMode.Silent;
    }
  }, [player, preferences.gameCuesEnabled]);

  const screen = useAnimatedStyle(() => {
    const entranceProgress = interpolate(
      progress.value,
      [0, GET_READY_ENTRANCE_END_PROGRESS],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const exitProgress = interpolate(
      progress.value,
      [GET_READY_FADE_START_PROGRESS, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity:
        Easing.out(Easing.cubic)(entranceProgress) * (1 - Easing.inOut(Easing.cubic)(exitProgress)),
    };
  });
  const cat = useAnimatedStyle(() => {
    if (isReducedMotionEnabled) {
      return { opacity: 1, transform: [{ scale: 1 }, { translateY: 0 }] };
    }

    const entranceProgress = Easing.out(Easing.cubic)(
      interpolate(
        progress.value,
        [0, GET_READY_ENTRANCE_END_PROGRESS],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    );
    let bounceProgress = 0;

    if (
      progress.value >= GET_READY_BOUNCE_START_PROGRESS &&
      progress.value < GET_READY_BOUNCE_PEAK_PROGRESS
    ) {
      bounceProgress = Easing.out(Easing.quad)(
        interpolate(
          progress.value,
          [GET_READY_BOUNCE_START_PROGRESS, GET_READY_BOUNCE_PEAK_PROGRESS],
          [0, 1],
          Extrapolation.CLAMP,
        ),
      );
    } else if (
      progress.value >= GET_READY_BOUNCE_PEAK_PROGRESS &&
      progress.value <= GET_READY_BOUNCE_END_PROGRESS
    ) {
      bounceProgress =
        1 -
        Easing.inOut(Easing.quad)(
          interpolate(
            progress.value,
            [GET_READY_BOUNCE_PEAK_PROGRESS, GET_READY_BOUNCE_END_PROGRESS],
            [0, 1],
            Extrapolation.CLAMP,
          ),
        );
    }

    return {
      opacity: entranceProgress,
      transform: [
        { scale: 0.8 + 0.2 * entranceProgress + 0.06 * bounceProgress },
        { translateY: 16 * (1 - entranceProgress) - 5 * bounceProgress },
      ],
    };
  });
  const title = useAnimatedStyle(() => {
    if (isReducedMotionEnabled) {
      return { opacity: 1, transform: [{ translateY: 0 }] };
    }

    const entranceProgress = Easing.out(Easing.cubic)(
      interpolate(
        progress.value,
        [0.05, GET_READY_ENTRANCE_END_PROGRESS],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    );

    return {
      opacity: entranceProgress,
      transform: [{ translateY: 16 * (1 - entranceProgress) }],
    };
  });
  const sparkle = useAnimatedStyle(() => {
    if (isReducedMotionEnabled) {
      return { opacity: 0 };
    }

    let sparkleProgress = 0;

    if (
      progress.value >= GET_READY_BOUNCE_START_PROGRESS &&
      progress.value < GET_READY_BOUNCE_PEAK_PROGRESS
    ) {
      sparkleProgress = Easing.out(Easing.quad)(
        interpolate(
          progress.value,
          [GET_READY_BOUNCE_START_PROGRESS, GET_READY_BOUNCE_PEAK_PROGRESS],
          [0, 1],
          Extrapolation.CLAMP,
        ),
      );
    } else if (
      progress.value >= GET_READY_BOUNCE_PEAK_PROGRESS &&
      progress.value <= GET_READY_BOUNCE_END_PROGRESS
    ) {
      sparkleProgress =
        1 -
        Easing.inOut(Easing.quad)(
          interpolate(
            progress.value,
            [GET_READY_BOUNCE_PEAK_PROGRESS, GET_READY_BOUNCE_END_PROGRESS],
            [0, 1],
            Extrapolation.CLAMP,
          ),
        );
    }

    return {
      opacity: sparkleProgress,
      transform: [{ scale: 0.4 + 0.6 * sparkleProgress }],
    };
  });

  return { screen, cat, title, sparkle };
}
