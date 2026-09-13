import { Animated } from 'react-native';

import { PREPARATION_CARD_RADIUS, PREPARATION_TILE_RADIUS } from '../../constants';
import { PreparationLandingLayouts } from '../../types';
import { FLYING_CARD_COMPACT_FADE_START, FLYING_CARD_DETAIL_FADE_END } from './constants';

export function createFlyingCardAnimationStyle(
  progress: Animated.Value,
  layouts: PreparationLandingLayouts,
) {
  return {
    left: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.source.x, layouts.destination.x],
    }),
    top: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.source.y, layouts.destination.y],
    }),
    width: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.source.width, layouts.destination.width],
    }),
    height: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.source.height, layouts.destination.height],
    }),
    borderRadius: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [PREPARATION_CARD_RADIUS, PREPARATION_TILE_RADIUS],
    }),
  };
}

export function createDetailedContentOpacity(progress: Animated.Value) {
  return progress.interpolate({
    inputRange: [0, FLYING_CARD_DETAIL_FADE_END, 1],
    outputRange: [1, 0, 0],
  });
}

export function createCompactContentOpacity(progress: Animated.Value) {
  return progress.interpolate({
    inputRange: [0, FLYING_CARD_COMPACT_FADE_START, 1],
    outputRange: [0, 0, 1],
  });
}
