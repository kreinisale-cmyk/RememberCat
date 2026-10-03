import Check from 'lucide-react-native/icons/check';
import Flame from 'lucide-react-native/icons/flame';
import Sparkles from 'lucide-react-native/icons/sparkles';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';
import { MatchMode } from '@/features/GameSession/types';

import { MatchModeCatIcon } from '../MatchModeCatIcon/MatchModeCatIcon';
import {
  EASY_MODE_COLORS,
  HARD_MODE_COLORS,
  MATCH_MODE_ACCENT_ICON_SIZE,
  MATCH_MODE_ANIMATION_DURATION,
  MATCH_MODE_COPY,
  MATCH_MODE_ICON_SIZE,
  MATCH_MODE_STATUS_ICON_SIZE,
} from './constants';
import { styles } from './styles';
import { MatchModeSelectorProps } from './types';
import { createMatchModeAccessibilityLabel, getNextMatchMode } from './utils';

export function MatchModeSelector({ selectedMatchMode, onChange }: MatchModeSelectorProps) {
  const isEasy = selectedMatchMode === MatchMode.Easy;
  const animationProgress = useSharedValue(isEasy ? 1 : 0);
  const accentColor = isEasy ? EASY_MODE_COLORS.accent : HARD_MODE_COLORS.accent;
  const AccentIcon = isEasy ? Sparkles : Flame;

  useEffect(() => {
    animationProgress.value = withTiming(isEasy ? 1 : 0, {
      duration: MATCH_MODE_ANIMATION_DURATION,
      easing: Easing.inOut(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    });
  }, [animationProgress, isEasy]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animationProgress.value,
      [0, 1],
      [HARD_MODE_COLORS.background, EASY_MODE_COLORS.background],
    ),
    borderColor: interpolateColor(
      animationProgress.value,
      [0, 1],
      [HARD_MODE_COLORS.border, EASY_MODE_COLORS.border],
    ),
  }));

  const catTileAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animationProgress.value,
      [0, 1],
      [HARD_MODE_COLORS.tile, EASY_MODE_COLORS.tile],
    ),
    transform: [{ rotate: `${interpolate(animationProgress.value, [0, 1], [-3, 3])}deg` }],
  }));

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animationProgress.value,
      [0, 1],
      [HARD_MODE_COLORS.accent, EASY_MODE_COLORS.accent],
    ),
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animationProgress.value }],
  }));

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - animationProgress.value }],
  }));

  function toggleMatchMode() {
    onChange(getNextMatchMode(selectedMatchMode));
  }

  return (
    <Animated.View style={[styles.animatedContainer, containerAnimatedStyle]}>
      <Pressable
        accessibilityLabel={createMatchModeAccessibilityLabel(selectedMatchMode)}
        accessibilityRole="switch"
        accessibilityState={{ checked: isEasy }}
        onPress={toggleMatchMode}
        style={({ pressed }) => [styles.button, pressed && styles.pressedButton]}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.catTile, catTileAnimatedStyle]}>
            <MatchModeCatIcon
              color={accentColor}
              matchMode={selectedMatchMode}
              size={MATCH_MODE_ICON_SIZE}
            />
          </Animated.View>
          <View style={styles.copy}>
            <View style={styles.eyebrow}>
              <AccentIcon
                color={accentColor}
                size={MATCH_MODE_ACCENT_ICON_SIZE}
                strokeWidth={2.4}
              />
              <ThemedText style={[styles.mode, { color: accentColor }]}>
                {selectedMatchMode}
              </ThemedText>
            </View>
            <ThemedText numberOfLines={1} style={styles.title}>
              {MATCH_MODE_COPY.title}
            </ThemedText>
            <ThemedText style={styles.hint}>{MATCH_MODE_COPY.hint}</ThemedText>
          </View>
          <Animated.View style={[styles.status, statusAnimatedStyle]}>
            <Animated.View style={[styles.statusContent, checkAnimatedStyle]}>
              <Check
                color={RememberCatColors.primaryForeground}
                size={MATCH_MODE_STATUS_ICON_SIZE}
                strokeWidth={3}
              />
            </Animated.View>
            <Animated.View style={[styles.statusContent, dotAnimatedStyle]}>
              <View style={styles.dot} />
            </Animated.View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
