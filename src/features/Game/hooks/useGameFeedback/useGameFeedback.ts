import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { useAppPreferences } from '@/features/AppPreferences/useAppPreferences/useAppPreferences';

import {
  ANSWER_AUDIO_PLAYER_OPTIONS,
  FAILURE_AUDIO_FILENAMES,
  GAME_OUTCOME_ANNOUNCEMENTS,
  MATCH_FAILURE_AUDIO_SOURCES,
  MATCH_SUCCESS_AUDIO_SOURCES,
  PREPARATION_WORD_LEARNED_ANNOUNCEMENT,
  SUCCESS_AUDIO_FILENAMES,
} from './constants';
import { GameOutcomeFeedback, UseGameFeedbackOptions, UseGameFeedbackResult } from './types';
import { createShuffledSoundBag, isAnswerOutcome, selectGameOutcomeFeedback } from './utils';
import { GAME_AUDIO_MODE } from '../useGameAudioPlayback/constants';
import { logAudioPlayback } from '../useGameAudioPlayback/playback';
import { AudioPlaybackEvent } from '../useGameAudioPlayback/types';
import { useGameAudioPlayback } from '../useGameAudioPlayback/useGameAudioPlayback';

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
  const successPlayerOne = useAudioPlayer(
    MATCH_SUCCESS_AUDIO_SOURCES[0],
    ANSWER_AUDIO_PLAYER_OPTIONS,
  );
  const successPlayerTwo = useAudioPlayer(
    MATCH_SUCCESS_AUDIO_SOURCES[1],
    ANSWER_AUDIO_PLAYER_OPTIONS,
  );
  const successPlayerThree = useAudioPlayer(
    MATCH_SUCCESS_AUDIO_SOURCES[2],
    ANSWER_AUDIO_PLAYER_OPTIONS,
  );
  const failurePlayerOne = useAudioPlayer(
    MATCH_FAILURE_AUDIO_SOURCES[0],
    ANSWER_AUDIO_PLAYER_OPTIONS,
  );
  const failurePlayerTwo = useAudioPlayer(
    MATCH_FAILURE_AUDIO_SOURCES[1],
    ANSWER_AUDIO_PLAYER_OPTIONS,
  );
  const failurePlayerThree = useAudioPlayer(
    MATCH_FAILURE_AUDIO_SOURCES[2],
    ANSWER_AUDIO_PLAYER_OPTIONS,
  );
  const previousSuccessIndexRef = useRef<number | null>(null);
  const previousFailureIndexRef = useRef<number | null>(null);
  const successBagRef = useRef<number[]>([]);
  const failureBagRef = useRef<number[]>([]);
  const successPlayers = useMemo(
    () => [successPlayerOne, successPlayerTwo, successPlayerThree],
    [successPlayerOne, successPlayerThree, successPlayerTwo],
  );
  const failurePlayers = useMemo(
    () => [failurePlayerOne, failurePlayerTwo, failurePlayerThree],
    [failurePlayerOne, failurePlayerThree, failurePlayerTwo],
  );
  const playAnswer = useGameAudioPlayback(
    options.hasActiveSession && !isPreferencesLoading && preferences.catReactionsEnabled,
  );

  const announcePreparationWordLearned = useCallback(() => {
    announceForAccessibility(PREPARATION_WORD_LEARNED_ANNOUNCEMENT);
  }, []);

  useEffect(() => {
    void setAudioModeAsync(GAME_AUDIO_MODE).catch((error) => {
      logAudioPlayback(AudioPlaybackEvent.Error, 'audio-mode', error);
    });
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

    if (!isPreferencesLoading && preferences.catReactionsEnabled && isAnswerOutcome(outcome)) {
      const players = outcome === GameOutcomeFeedback.Correct ? successPlayers : failurePlayers;
      const previousIndexRef =
        outcome === GameOutcomeFeedback.Correct ? previousSuccessIndexRef : previousFailureIndexRef;
      const bagRef = outcome === GameOutcomeFeedback.Correct ? successBagRef : failureBagRef;
      const filenames =
        outcome === GameOutcomeFeedback.Correct ? SUCCESS_AUDIO_FILENAMES : FAILURE_AUDIO_FILENAMES;

      if (bagRef.current.length === 0) {
        bagRef.current = createShuffledSoundBag(players.length, previousIndexRef.current);
      }

      const selectedIndex = bagRef.current.shift()!;
      const selectedPlayer = players[selectedIndex];

      previousIndexRef.current = selectedIndex;
      playAnswer(selectedPlayer, filenames[selectedIndex]);
    }

    if (!isPreferencesLoading && preferences.hapticsEnabled) {
      void emitHapticFeedback(outcome).catch(() => undefined);
    }
  }, [
    failurePlayers,
    isPreferencesLoading,
    options,
    playAnswer,
    preferences.catReactionsEnabled,
    preferences.hapticsEnabled,
    successPlayers,
  ]);

  return {
    announcePreparationWordLearned,
  };
}
