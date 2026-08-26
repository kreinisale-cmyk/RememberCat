import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  CELEBRATION_CAT,
  CELEBRATION_SPARKLE,
  CELEBRATION_SPRING_DAMPING,
  CELEBRATION_SPRING_STIFFNESS,
} from './constants';
import { styles } from './styles';
import { LearnedWordCelebrationProps } from './types';
import { createLearnedWordCelebrationMessage } from './utils';

export function LearnedWordCelebration({ word }: LearnedWordCelebrationProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: CELEBRATION_SPRING_DAMPING,
      stiffness: CELEBRATION_SPRING_STIFFNESS,
      useNativeDriver: true,
    }).start();
  }, [entranceAnimation]);

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={createLearnedWordCelebrationMessage(word)}
      style={styles.backdrop}
    >
      <Animated.View
        style={[
          styles.glow,
          { opacity: entranceAnimation, transform: [{ scale: entranceAnimation }] },
        ]}
      />
      <Animated.View
        style={[
          styles.card,
          { opacity: entranceAnimation, transform: [{ scale: entranceAnimation }] },
        ]}
      >
        <View style={styles.sparkleRow}>
          <ThemedText style={styles.sparkle}>{CELEBRATION_SPARKLE}</ThemedText>
          <ThemedText style={styles.cat}>{CELEBRATION_CAT}</ThemedText>
          <ThemedText style={styles.sparkle}>{CELEBRATION_SPARKLE}</ThemedText>
        </View>
        <ThemedText style={styles.message}>{createLearnedWordCelebrationMessage(word)}</ThemedText>
      </Animated.View>
    </View>
  );
}
