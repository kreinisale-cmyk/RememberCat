import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import {
  CAT_BOB_DISTANCE,
  CAT_BOB_DURATION_MS,
  PRACTICE_TRANSITION_BUTTON_LABEL,
  PRACTICE_TRANSITION_MESSAGE,
  PRACTICE_TRANSITION_MOVIE_DURATION_MS,
  PRACTICE_TRANSITION_TITLE,
} from './constants';
import { styles } from './styles';
import { PracticeTransitionProps } from './types';

export function PracticeTransition({ onContinue }: PracticeTransitionProps) {
  const [isStartButtonVisible, setIsStartButtonVisible] = useState(false);
  const entranceAnimation = useRef(new Animated.Value(0)).current;
  const catBobAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const catBobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(catBobAnimation, {
          toValue: 1,
          duration: CAT_BOB_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(catBobAnimation, {
          toValue: 0,
          duration: CAT_BOB_DURATION_MS,
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: 9,
      stiffness: 95,
      useNativeDriver: true,
    }).start();
    catBobLoop.start();

    const movieTimeout = setTimeout(() => {
      setIsStartButtonVisible(true);
      Animated.spring(buttonAnimation, {
        toValue: 1,
        damping: 10,
        stiffness: 120,
        useNativeDriver: true,
      }).start();
    }, PRACTICE_TRANSITION_MOVIE_DURATION_MS);

    return () => {
      clearTimeout(movieTimeout);
      catBobLoop.stop();
    };
  }, [buttonAnimation, catBobAnimation, entranceAnimation]);

  const catTranslateY = catBobAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -CAT_BOB_DISTANCE],
  });
  const catRotation = catBobAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.decorations}>
        <ThemedText style={styles.topSparkle}>✦</ThemedText>
        <ThemedText style={styles.leftSparkle}>✧</ThemedText>
        <ThemedText style={styles.rightSparkle}>✦</ThemedText>
        <View style={styles.leftCloud} />
        <View style={styles.rightCloud} />
      </View>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.catStage,
            {
              opacity: entranceAnimation,
              transform: [
                { scale: entranceAnimation },
                { translateY: catTranslateY },
                { rotate: catRotation },
              ],
            },
          ]}
        >
          <View style={styles.catGlow} />
          <ThemedText accessibilityLabel="A happy cat cheering" style={styles.cat}>
            🐱
          </ThemedText>
          <ThemedText style={styles.celebrationPaws}>🐾　🐾</ThemedText>
        </Animated.View>
        <Animated.View
          style={[
            styles.storyCard,
            {
              opacity: entranceAnimation,
              transform: [{ translateY: catTranslateY }],
            },
          ]}
        >
          <ThemedText accessibilityRole="header" style={styles.title}>
            {PRACTICE_TRANSITION_TITLE}
          </ThemedText>
          <ThemedText style={styles.message}>{PRACTICE_TRANSITION_MESSAGE}</ThemedText>
        </Animated.View>
        <View style={styles.actionArea}>
          {isStartButtonVisible ? (
            <Animated.View
              style={{
                opacity: buttonAnimation,
                transform: [{ scale: buttonAnimation }],
              }}
            >
              <Pressable accessibilityRole="button" onPress={onContinue} style={styles.button}>
                <ThemedText style={styles.buttonText}>
                  {PRACTICE_TRANSITION_BUTTON_LABEL}
                </ThemedText>
                <ThemedText style={styles.buttonArrow}>→</ThemedText>
              </Pressable>
            </Animated.View>
          ) : (
            <View accessibilityLabel="Animation playing" style={styles.movieIndicator}>
              <View style={styles.movieDot} />
              <View style={[styles.movieDot, styles.movieDotMuted]} />
              <View style={[styles.movieDot, styles.movieDotFaint]} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
