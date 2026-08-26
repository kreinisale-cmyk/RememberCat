import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  ACKNOWLEDGE_LABEL,
  FINAL_ACKNOWLEDGE_LABEL,
  PREPARATION_CLOSE_ACCESSIBILITY_LABEL,
  PREPARATION_ENTRANCE_DISTANCE,
  PREPARATION_HINT,
  PREPARATION_KICKER,
  PREPARATION_SPRING_DAMPING,
  PREPARATION_SPRING_STIFFNESS,
  PREPARATION_TITLE,
  TRANSLATION_LABEL,
  WORD_LABEL,
} from './constants';
import { styles } from './styles';
import { PreparationSessionProps } from './types';
import { createPreparationProgressLabel, isFinalPreparationWord } from './utils';

export function PreparationSession({
  wordPair,
  currentWordNumber,
  totalWordCount,
  onAcknowledge,
  onClose,
}: PreparationSessionProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;
  const progress = currentWordNumber / totalWordCount;
  const isFinalWord = isFinalPreparationWord(currentWordNumber, totalWordCount);

  useEffect(() => {
    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: PREPARATION_SPRING_DAMPING,
      stiffness: PREPARATION_SPRING_STIFFNESS,
      useNativeDriver: true,
    }).start();
  }, [entranceAnimation, wordPair.id]);

  const cardTranslateX = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [PREPARATION_ENTRANCE_DISTANCE, 0],
  });

  return (
    <View style={styles.content}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={PREPARATION_CLOSE_ACCESSIBILITY_LABEL}
          onPress={onClose}
          style={styles.closeButton}
        >
          <ThemedText style={styles.close}>×</ThemedText>
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <ThemedText style={styles.progressLabel}>
          {createPreparationProgressLabel(currentWordNumber, totalWordCount)}
        </ThemedText>
      </View>
      <View accessibilityRole="header" style={styles.heading}>
        <ThemedText style={styles.kicker}>{PREPARATION_KICKER}</ThemedText>
        <ThemedText style={styles.title}>{PREPARATION_TITLE}</ThemedText>
        <ThemedText style={styles.hint}>{PREPARATION_HINT}</ThemedText>
      </View>
      <View style={styles.cardArea}>
        <Animated.View
          key={wordPair.id}
          style={[
            styles.card,
            {
              opacity: entranceAnimation,
              transform: [{ translateX: cardTranslateX }, { scale: entranceAnimation }],
            },
          ]}
        >
          <View pointerEvents="none" style={styles.cardDecoration} />
          <View style={styles.vocabulary}>
            <ThemedText style={styles.fieldLabel}>{WORD_LABEL}</ThemedText>
            <ThemedText adjustsFontSizeToFit numberOfLines={2} style={styles.word}>
              {wordPair.word}
            </ThemedText>
            <View style={styles.divider} />
            <ThemedText style={styles.fieldLabel}>{TRANSLATION_LABEL}</ThemedText>
            <ThemedText adjustsFontSizeToFit numberOfLines={3} style={styles.translation}>
              {wordPair.translation}
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={onAcknowledge}
            style={styles.acknowledgeButton}
          >
            <ThemedText style={styles.acknowledgeText}>
              {isFinalWord ? FINAL_ACKNOWLEDGE_LABEL : ACKNOWLEDGE_LABEL}
            </ThemedText>
            <ThemedText style={styles.acknowledgeIcon}>✓</ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
