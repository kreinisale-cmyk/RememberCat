import { AudioPlayer, setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { useAppPreferences } from '@/features/AppPreferences/useAppPreferences/useAppPreferences';

import {
  GAME_OUTCOME_ANNOUNCEMENTS,
  MATCH_FAILURE_AUDIO_SOURCES,
  MATCH_SUCCESS_AUDIO_SOURCES,
  PREPARATION_WORD_LEARNED_ANNOUNCEMENT,
} from './constants';
import { GameOutcomeFeedback, UseGameFeedbackOptions, UseGameFeedbackResult } from './types';
import { didMatchingOutcomeChange, selectGameOutcomeFeedback, selectRandomIndex } from './utils';

function stopAudioPlayers(players: readonly AudioPlayer[]) {
  players.forEach((player) => {
    player.pause();
  });
}

async function playAudioPlayer(player: AudioPlayer, allPlayers: readonly AudioPlayer[]) {
  stopAudioPlayers(allPlayers);
  await player.seekTo(0);
  player.play();
}

async function emitHapticFeedback(outcome: GameOutcomeFeedback) {
  const isNegativeOutcome =
    outcome === GameOutcomeFeedback.Incorrect || outcome === GameOutcomeFeedback.ChallengeFailed;

  if (Platform.OS === 'android') {
    const androidHaptic = isNegativeOutcome
      ? Haptics.AndroidHaptics.Reject
      : Haptics.AndroidHaptics.Confirm;

    await Haptics.performAndroidHapticsAsync(androidHaptic);

    return;
  }

  const notificationType = isNegativeOutcome
    ? Haptics.NotificationFeedbackType.Error
    : Haptics.NotificationFeedbackType.Success;

  await Haptics.notificationAsync(notificationType);
}

function announceForAccessibility(message: string) {
  try {
    AccessibilityInfo.announceForAccessibility(message);
  } catch {
    // Accessibility API failures must never interrupt gameplay.
  }
}

export function useGameFeedback(options: UseGameFeedbackOptions): UseGameFeedbackResult {
  const { isPreferencesLoading, preferences } = useAppPreferences();
  const previousOptionsRef = useRef(options);
  const successPlayerOne = useAudioPlayer(MATCH_SUCCESS_AUDIO_SOURCES[0]);
  const successPlayerTwo = useAudioPlayer(MATCH_SUCCESS_AUDIO_SOURCES[1]);
  const successPlayerThree = useAudioPlayer(MATCH_SUCCESS_AUDIO_SOURCES[2]);
  const failurePlayerOne = useAudioPlayer(MATCH_FAILURE_AUDIO_SOURCES[0]);
  const failurePlayerTwo = useAudioPlayer(MATCH_FAILURE_AUDIO_SOURCES[1]);
  const failurePlayerThree = useAudioPlayer(MATCH_FAILURE_AUDIO_SOURCES[2]);
  const successPlayers = useMemo(
    () => [successPlayerOne, successPlayerTwo, successPlayerThree],
    [successPlayerOne, successPlayerThree, successPlayerTwo],
  );
  const failurePlayers = useMemo(
    () => [failurePlayerOne, failurePlayerTwo, failurePlayerThree],
    [failurePlayerOne, failurePlayerThree, failurePlayerTwo],
  );
  const allPlayers = useMemo(
    () => [...successPlayers, ...failurePlayers],
    [failurePlayers, successPlayers],
  );

  const announcePreparationWordLearned = useCallback(() => {
    announceForAccessibility(PREPARATION_WORD_LEARNED_ANNOUNCEMENT);
  }, []);

  useEffect(() => {
    void setAudioModeAsync({
      interruptionMode: 'mixWithOthers',
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    const previousOptions = previousOptionsRef.current;
    previousOptionsRef.current = options;

    if (!options.hasActiveSession) {
      return;
    }

    const outcome = selectGameOutcomeFeedback(options, previousOptions);

    if (!outcome) {
      return;
    }

    announceForAccessibility(GAME_OUTCOME_ANNOUNCEMENTS[outcome]);

    if (
      !isPreferencesLoading &&
      preferences.catReactionsEnabled &&
      didMatchingOutcomeChange(options, previousOptions)
    ) {
      const players = outcome === GameOutcomeFeedback.Correct ? successPlayers : failurePlayers;
      const selectedPlayer = players[selectRandomIndex(players.length)];

      void playAudioPlayer(selectedPlayer, allPlayers).catch(() => undefined);
    }

    if (!isPreferencesLoading && preferences.hapticsEnabled) {
      void emitHapticFeedback(outcome).catch(() => undefined);
    }
  }, [
    allPlayers,
    failurePlayers,
    isPreferencesLoading,
    options,
    preferences.catReactionsEnabled,
    preferences.hapticsEnabled,
    successPlayers,
  ]);

  return {
    announcePreparationWordLearned,
  };
}
