import { useEffect } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type FloatingHeartProps = { delayMs: number; size: number; style: StyleProp<TextStyle> };
const FLOAT_DISTANCE = 12;
const FLOAT_DURATION_MS = 1900;
const styles = StyleSheet.create({
  heart: { position: 'absolute', color: '#e98f8f', opacity: 0.78 },
});

export function FloatingHeart({ delayMs, size, style }: FloatingHeartProps) {
  const offset = useSharedValue(0);
  useEffect(() => {
    const duration = FLOAT_DURATION_MS + delayMs;
    offset.value = withRepeat(
      withSequence(
        withTiming(-FLOAT_DISTANCE, { duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(FLOAT_DISTANCE, { duration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [delayMs, offset]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));
  return (
    <Animated.Text style={[styles.heart, { fontSize: size }, style, animatedStyle]}>
      ♥
    </Animated.Text>
  );
}
