import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import {
  ANGRY_CAT_PAUSE_DURATION_MS,
  ANGRY_CAT_SHAKE_DISTANCE,
  ANGRY_CAT_SHAKE_DURATION_MS,
  FINAL_QUIZ_TRANSITION_BUTTON_LABEL,
  FINAL_QUIZ_TRANSITION_MESSAGE,
  FINAL_QUIZ_TRANSITION_TITLE,
} from './constants';
import { styles } from './styles';
import { FinalQuizTransitionProps } from './types';

export function FinalQuizTransition({ onContinue }: FinalQuizTransitionProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const angryCatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: ANGRY_CAT_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -1,
          duration: ANGRY_CAT_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: ANGRY_CAT_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.delay(ANGRY_CAT_PAUSE_DURATION_MS),
      ]),
    );

    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: 10,
      stiffness: 115,
      useNativeDriver: true,
    }).start();
    angryCatLoop.start();

    return () => angryCatLoop.stop();
  }, [entranceAnimation, shakeAnimation]);

  const shakeTranslateX = shakeAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-ANGRY_CAT_SHAKE_DISTANCE, 0, ANGRY_CAT_SHAKE_DISTANCE],
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View pointerEvents="none" style={styles.decorations}>
        <ThemedText style={styles.leftBolt}>ϟ</ThemedText>
        <ThemedText style={styles.rightBolt}>ϟ</ThemedText>
        <View style={styles.topOrb} />
        <View style={styles.bottomOrb} />
      </View>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.catStage,
            {
              opacity: entranceAnimation,
              transform: [{ scale: entranceAnimation }, { translateX: shakeTranslateX }],
            },
          ]}
        >
          <View style={styles.catGlow} />
          <ThemedText accessibilityLabel="A determined angry cat" style={styles.cat}>
            😾
          </ThemedText>
        </Animated.View>
        <Animated.View
          style={[
            styles.copy,
            {
              opacity: entranceAnimation,
              transform: [{ scale: entranceAnimation }],
            },
          ]}
        >
          <ThemedText accessibilityRole="header" style={styles.title}>
            {FINAL_QUIZ_TRANSITION_TITLE}
          </ThemedText>
          <ThemedText style={styles.message}>{FINAL_QUIZ_TRANSITION_MESSAGE}</ThemedText>
        </Animated.View>
        <Pressable accessibilityRole="button" onPress={onContinue} style={styles.button}>
          <ThemedText style={styles.buttonText}>{FINAL_QUIZ_TRANSITION_BUTTON_LABEL}</ThemedText>
          <ThemedText style={styles.buttonIcon}>🔥</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
