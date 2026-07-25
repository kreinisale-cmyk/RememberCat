import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BOB_DISTANCE = 7;
const BOB_DURATION_MS = 1800;
const styles = StyleSheet.create({
  wrap: {
    width: 166,
    height: 166,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  orbit: {
    position: 'absolute',
    width: 158,
    height: 158,
    borderRadius: 79,
    borderWidth: 1.5,
    borderColor: 'rgba(213,138,111,0.32)',
    transform: [{ rotate: '-21deg' }],
  },
  ear: { position: 'absolute', top: 25, width: 46, height: 51, backgroundColor: '#d48765' },
  earLeft: { left: 29, borderTopLeftRadius: 10, transform: [{ rotate: '-37deg' }] },
  earRight: { right: 29, borderTopRightRadius: 10, transform: [{ rotate: '37deg' }] },
  face: {
    width: 116,
    height: 105,
    borderRadius: 48,
    backgroundColor: '#d48765',
    alignItems: 'center',
    paddingTop: 33,
  },
  eyeRow: { flexDirection: 'row', gap: 25 },
  eye: {
    width: 17,
    height: 21,
    borderRadius: 10,
    backgroundColor: '#fff8df',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: { width: 6, height: 13, borderRadius: 5, backgroundColor: '#50342d' },
  nose: { width: 10, height: 7, borderRadius: 7, backgroundColor: '#b85e63', marginTop: 9 },
  mouth: {
    width: 18,
    height: 9,
    borderBottomWidth: 2,
    borderColor: '#75433b',
    borderRadius: 12,
    marginTop: -1,
  },
});

export function CatMark() {
  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        withTiming(-BOB_DISTANCE, { duration: BOB_DURATION_MS, easing: Easing.inOut(Easing.sin) }),
        withTiming(BOB_DISTANCE, { duration: BOB_DURATION_MS, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [offset]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }] }));
  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <View style={styles.orbit} />
      <View style={[styles.ear, styles.earLeft]} />
      <View style={[styles.ear, styles.earRight]} />
      <View style={styles.face}>
        <View style={styles.eyeRow}>
          <View style={styles.eye}>
            <View style={styles.pupil} />
          </View>
          <View style={styles.eye}>
            <View style={styles.pupil} />
          </View>
        </View>
        <View style={styles.nose} />
        <View style={styles.mouth} />
      </View>
    </Animated.View>
  );
}
