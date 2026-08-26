import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  CHALLENGE_EXIT_LABEL,
  CHALLENGE_FAILED_KICKER,
  CHALLENGE_FAILED_MESSAGE,
  CHALLENGE_FAILED_TITLE,
  CHALLENGE_RETRY_LABEL,
  FAILURE_ENTRANCE_DISTANCE,
  FAILURE_SPRING_DAMPING,
  FAILURE_SPRING_STIFFNESS,
} from './constants';
import { styles } from './styles';
import { ChallengeFailedProps } from './types';
import { createFailureScoreLabel, createFailureStageLabel } from './utils';

export function ChallengeFailed({
  phase,
  completedMatchCount,
  targetMatchCount,
  onRetry,
  onClose,
}: ChallengeFailedProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: FAILURE_SPRING_DAMPING,
      stiffness: FAILURE_SPRING_STIFFNESS,
      useNativeDriver: true,
    }).start();
  }, [entranceAnimation]);

  const translateY = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [FAILURE_ENTRANCE_DISTANCE, 0],
  });

  return (
    <Animated.View
      style={[
        styles.content,
        { opacity: entranceAnimation, transform: [{ translateY }, { scale: entranceAnimation }] },
      ]}
    >
      <View style={styles.iconStage}>
        <ThemedText accessibilityLabel="A surprised cat" style={styles.icon}>
          🙀
        </ThemedText>
      </View>
      <View style={styles.copy}>
        <ThemedText style={styles.kicker}>{CHALLENGE_FAILED_KICKER}</ThemedText>
        <ThemedText accessibilityRole="header" style={styles.title}>
          {CHALLENGE_FAILED_TITLE}
        </ThemedText>
        <ThemedText style={styles.stage}>{createFailureStageLabel(phase)}</ThemedText>
        <ThemedText style={styles.score}>
          {createFailureScoreLabel(completedMatchCount, targetMatchCount)}
        </ThemedText>
        <ThemedText style={styles.message}>{CHALLENGE_FAILED_MESSAGE}</ThemedText>
      </View>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
        <ThemedText style={styles.retryText}>{CHALLENGE_RETRY_LABEL}</ThemedText>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.exitButton}>
        <ThemedText style={styles.exitText}>{CHALLENGE_EXIT_LABEL}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}
