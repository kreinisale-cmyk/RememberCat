import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { SUCCESS_ANIMATION_RISE, SUCCESS_ANIMATION_SCALE } from './constants';
import { styles } from './styles';

export function FinalQuizSuccessAnimation() {
  const entranceAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: 7,
      stiffness: 130,
      useNativeDriver: true,
    }).start();
  }, [entranceAnimation]);

  const translateY = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [SUCCESS_ANIMATION_RISE, 0],
  });
  const scale = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [SUCCESS_ANIMATION_SCALE, 1],
  });

  return (
    <View
      accessible
      accessibilityLiveRegion="assertive"
      accessibilityLabel="Correct answer. The cat gives you a thumbs up."
      pointerEvents="none"
      style={styles.overlay}
    >
      <Animated.View
        style={[
          styles.celebration,
          {
            opacity: entranceAnimation,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        <ThemedText style={styles.sparkles}>✦　✧　✦</ThemedText>
        <View style={styles.catBubble}>
          <ThemedText style={styles.cat}>🐱</ThemedText>
          <ThemedText style={styles.thumb}>👍</ThemedText>
        </View>
        <ThemedText style={styles.label}>Correct!</ThemedText>
      </Animated.View>
    </View>
  );
}
