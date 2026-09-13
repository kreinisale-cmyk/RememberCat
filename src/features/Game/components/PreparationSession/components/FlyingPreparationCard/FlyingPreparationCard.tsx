import { Animated, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { TRANSLATION_LABEL, WORD_LABEL } from '../../constants';
import { FLYING_PREPARATION_CARD_COPY } from './constants';
import { styles } from './styles';
import { FlyingPreparationCardProps } from './types';
import {
  createCompactContentOpacity,
  createDetailedContentOpacity,
  createFlyingCardAnimationStyle,
} from './utils';

export function FlyingPreparationCard({ layouts, progress, wordPair }: FlyingPreparationCardProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.card, createFlyingCardAnimationStyle(progress, layouts)]}
    >
      <Animated.View
        style={[styles.detailedContent, { opacity: createDetailedContentOpacity(progress) }]}
      >
        <View pointerEvents="none" style={styles.decoration} />
        <View style={styles.vocabulary}>
          <ThemedText style={styles.fieldLabel}>{WORD_LABEL}</ThemedText>
          <ThemedText numberOfLines={2} style={styles.largeWord}>
            {wordPair.word}
          </ThemedText>
          <View style={styles.largeDivider} />
          <ThemedText style={styles.fieldLabel}>{TRANSLATION_LABEL}</ThemedText>
          <ThemedText numberOfLines={2} style={styles.largeTranslation}>
            {wordPair.translation}
          </ThemedText>
        </View>
        <View style={styles.buttonPreview}>
          <ThemedText style={styles.buttonPreviewText}>
            {FLYING_PREPARATION_CARD_COPY.confirmed}
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.compactContent, { opacity: createCompactContentOpacity(progress) }]}
      >
        <ThemedText numberOfLines={2} style={styles.compactWord}>
          {wordPair.word}
        </ThemedText>
        <View style={styles.compactDivider} />
        <ThemedText numberOfLines={2} style={styles.compactTranslation}>
          {wordPair.translation}
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );
}
