import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  ANSWER_FEEDBACK_SCALE,
  ANSWER_SHAKE_DISTANCE,
  ANSWER_SHAKE_DURATION_MS,
} from './constants';
import { styles } from './styles';
import { FinalQuizAnswerOptionProps } from './types';
import { createAnswerAccessibilityLabel } from './utils';

export function FinalQuizAnswerOption({
  label,
  disabled,
  isCorrect,
  isIncorrect,
  onPress,
}: FinalQuizAnswerOptionProps) {
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCorrect) {
      Animated.sequence([
        Animated.spring(scaleAnimation, {
          toValue: ANSWER_FEEDBACK_SCALE,
          damping: 7,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          damping: 8,
          stiffness: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isIncorrect) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: -ANSWER_SHAKE_DISTANCE,
          duration: ANSWER_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: ANSWER_SHAKE_DISTANCE,
          duration: ANSWER_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: ANSWER_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCorrect, isIncorrect, scaleAnimation, shakeAnimation]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale: scaleAnimation }, { translateX: shakeAnimation }],
        },
      ]}
    >
      <Pressable
        android_disableSound
        accessibilityRole="button"
        accessibilityLabel={createAnswerAccessibilityLabel(label, isCorrect, isIncorrect)}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && !disabled && styles.buttonPressed,
          isCorrect && styles.correctButton,
          isIncorrect && styles.incorrectButton,
        ]}
      >
        <ThemedText
          numberOfLines={2}
          adjustsFontSizeToFit
          style={[
            styles.label,
            isCorrect && styles.correctLabel,
            isIncorrect && styles.incorrectLabel,
          ]}
        >
          {label}
        </ThemedText>
        {isCorrect ? <ThemedText style={styles.check}>✓</ThemedText> : null}
      </Pressable>
    </Animated.View>
  );
}
