import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import {
  CAT_BOUNCE_DISTANCE,
  CAT_BOUNCE_DURATION_MS,
  CAT_ROTATION_DEGREES,
  ENTRANCE_TRANSLATE_Y,
  TRANSITION_BUTTON_LABEL,
  TRANSITION_MESSAGE,
} from './constants';
import { styles } from './styles';
import { TimedRoundTransitionProps } from './types';
import { createTimedRoundTransitionKicker, createTimedRoundTransitionTitle } from './utils';

export function TimedRoundTransition({ targetPhase, onContinue }: TimedRoundTransitionProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;
  const catBounceAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const catBounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(catBounceAnimation, {
          toValue: 1,
          duration: CAT_BOUNCE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(catBounceAnimation, {
          toValue: 0,
          duration: CAT_BOUNCE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: 9,
      stiffness: 105,
      useNativeDriver: true,
    }).start();
    catBounceLoop.start();

    return () => catBounceLoop.stop();
  }, [catBounceAnimation, entranceAnimation]);

  const entranceTranslateY = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [ENTRANCE_TRANSLATE_Y, 0],
  });
  const catTranslateY = catBounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -CAT_BOUNCE_DISTANCE],
  });
  const catRotation = catBounceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [`-${CAT_ROTATION_DEGREES}deg`, `${CAT_ROTATION_DEGREES}deg`],
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.decorations}>
        <View style={styles.topBubble} />
        <View style={styles.bottomBubble} />
        <ThemedText style={styles.leftSparkle}>✦</ThemedText>
        <ThemedText style={styles.rightSparkle}>✧</ThemedText>
      </View>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: entranceAnimation,
            transform: [{ translateY: entranceTranslateY }],
          },
        ]}
      >
        <View style={styles.levelPill}>
          <ThemedText style={styles.levelText}>
            {createTimedRoundTransitionKicker(targetPhase)}
          </ThemedText>
        </View>
        <Animated.View
          style={[
            styles.catStage,
            {
              transform: [{ translateY: catTranslateY }, { rotate: catRotation }],
            },
          ]}
        >
          <View style={styles.catGlow} />
          <ThemedText
            accessibilityLabel="An excited cat ready for the next level"
            style={styles.cat}
          >
            😸
          </ThemedText>
          <ThemedText style={styles.pawTrail}>🐾　🐾</ThemedText>
        </Animated.View>
        <View style={styles.copy}>
          <ThemedText accessibilityRole="header" style={styles.title}>
            {createTimedRoundTransitionTitle(targetPhase)}
          </ThemedText>
          <ThemedText style={styles.message}>{TRANSITION_MESSAGE}</ThemedText>
        </View>
        <Pressable accessibilityRole="button" onPress={onContinue} style={styles.button}>
          <ThemedText style={styles.buttonText}>{TRANSITION_BUTTON_LABEL}</ThemedText>
          <ThemedText style={styles.buttonIcon}>→</ThemedText>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
