import { Animated } from 'react-native';

import { WordPair } from '@/features/GameSession/types';

import { PreparationLandingLayouts } from '../../types';

export type FlyingPreparationCardProps = {
  layouts: PreparationLandingLayouts;
  progress: Animated.Value;
  wordPair: WordPair;
};
