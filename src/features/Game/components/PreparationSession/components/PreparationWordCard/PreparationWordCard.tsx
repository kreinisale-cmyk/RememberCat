import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { TRANSLATION_LABEL, WORD_LABEL } from '../../constants';
import { PREPARATION_WORD_CARD_ACCESSIBILITY_LABEL } from './constants';
import { styles } from './styles';
import { PreparationWordCardProps } from './types';
import { getPreparationAcknowledgeLabel } from './utils';

export const PreparationWordCard = forwardRef<View, PreparationWordCardProps>(
  function PreparationWordCard({ isDisabled, isFinalWord, onAcknowledge, wordPair }, ref) {
    return (
      <View
        ref={ref}
        accessibilityLabel={PREPARATION_WORD_CARD_ACCESSIBILITY_LABEL}
        style={styles.card}
      >
        <View pointerEvents="none" style={styles.cardDecoration} />
        <View style={styles.vocabulary}>
          <ThemedText style={styles.fieldLabel}>{WORD_LABEL}</ThemedText>
          <ThemedText adjustsFontSizeToFit numberOfLines={2} style={styles.word}>
            {wordPair.word}
          </ThemedText>
          <View style={styles.divider} />
          <ThemedText style={styles.fieldLabel}>{TRANSLATION_LABEL}</ThemedText>
          <ThemedText adjustsFontSizeToFit numberOfLines={3} style={styles.translation}>
            {wordPair.translation}
          </ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={isDisabled}
          onPress={onAcknowledge}
          style={({ pressed }) => [
            styles.acknowledgeButton,
            pressed && styles.acknowledgeButtonPressed,
          ]}
        >
          <ThemedText style={styles.acknowledgeText}>
            {getPreparationAcknowledgeLabel(isFinalWord)}
          </ThemedText>
          <ThemedText style={styles.acknowledgeIcon}>✓</ThemedText>
        </Pressable>
      </View>
    );
  },
);
