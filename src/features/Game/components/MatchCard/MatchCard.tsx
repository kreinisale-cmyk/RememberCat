import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { MATCH_FEEDBACK_DURATION_MS } from '../../constants';
import { MatchFeedback } from '../../types';
import {
  CARD_ENTER_SCALE,
  CARD_SELECTED_SCALE,
  CORRECT_CARD_HOLD_DURATION_MS,
  INCORRECT_CARD_SHAKE_DISTANCE,
  INCORRECT_CARD_SHAKE_DURATION_MS,
} from './constants';
import { styles } from './styles';
import { MatchCardProps } from './types';
import { createMatchOptionAccessibilityLabel } from './utils';

export function MatchCard({ label, selected, feedback, disabled, onPress }: MatchCardProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;
  const selectionAnimation = useRef(new Animated.Value(1)).current;
  const feedbackAnimation = useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: 9,
      stiffness: 130,
      useNativeDriver: true,
    }).start();
  }, [entranceAnimation]);

  useEffect(() => {
    if (feedback === MatchFeedback.Correct) {
      Animated.sequence([
        Animated.delay(CORRECT_CARD_HOLD_DURATION_MS),
        Animated.timing(feedbackAnimation, {
          toValue: 0,
          duration: MATCH_FEEDBACK_DURATION_MS - CORRECT_CARD_HOLD_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (feedback === MatchFeedback.Incorrect) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: -INCORRECT_CARD_SHAKE_DISTANCE,
          duration: INCORRECT_CARD_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: INCORRECT_CARD_SHAKE_DISTANCE,
          duration: INCORRECT_CARD_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: INCORRECT_CARD_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(selectionAnimation, {
        toValue: selected ? CARD_SELECTED_SCALE : 1,
        damping: 9,
        stiffness: 170,
        useNativeDriver: true,
      }).start();
      feedbackAnimation.setValue(1);
      shakeAnimation.setValue(0);
    }
  }, [feedback, feedbackAnimation, selected, selectionAnimation, shakeAnimation]);

  const entranceScale = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_ENTER_SCALE, 1],
  });

  let feedbackStyle;

  if (feedback === MatchFeedback.Correct) {
    feedbackStyle = styles.correct;
  } else if (feedback === MatchFeedback.Incorrect) {
    feedbackStyle = styles.incorrect;
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: entranceAnimation,
          transform: [
            { scale: entranceScale },
            { scale: selectionAnimation },
            { scale: feedbackAnimation },
            { translateX: shakeAnimation },
          ],
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={createMatchOptionAccessibilityLabel(label)}
        disabled={disabled}
        onPress={onPress}
        style={[styles.card, selected && styles.selected, feedbackStyle]}
      >
        <ThemedText numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
          {label}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}
