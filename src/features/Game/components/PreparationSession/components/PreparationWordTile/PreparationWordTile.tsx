import { forwardRef } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { styles } from './styles';
import { PreparationWordTileProps } from './types';
import { createPreparationSlotLabel } from './utils';

export const PreparationWordTile = forwardRef<View, PreparationWordTileProps>(
  function PreparationWordTile({ index, isPrepared, onLayout, wordPair }, ref) {
    return (
      <View
        ref={ref}
        accessible={isPrepared}
        accessibilityLabel={createPreparationSlotLabel(index, isPrepared, wordPair)}
        accessibilityElementsHidden={!isPrepared}
        collapsable={false}
        importantForAccessibility={isPrepared ? 'auto' : 'no-hide-descendants'}
        onLayout={onLayout}
        style={[styles.tile, isPrepared && styles.preparedTile]}
      >
        {isPrepared ? (
          <>
            <ThemedText adjustsFontSizeToFit numberOfLines={2} style={styles.word}>
              {wordPair.word}
            </ThemedText>
            <View style={styles.divider} />
            <ThemedText adjustsFontSizeToFit numberOfLines={2} style={styles.translation}>
              {wordPair.translation}
            </ThemedText>
          </>
        ) : null}
      </View>
    );
  },
);
