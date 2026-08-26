import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { DECK_SIZE_OPTIONS } from './constants';
import { styles } from './styles';
import { DeckSizeSelectorProps } from './types';
import { createDeckSizeAccessibilityLabel, isSelectedDeckSize } from './utils';

export function DeckSizeSelector({ selectedDeckSize, onChange }: DeckSizeSelectorProps) {
  return (
    <View style={styles.container}>
      {DECK_SIZE_OPTIONS.map((deckSize) => {
        const isSelected = isSelectedDeckSize(deckSize, selectedDeckSize);

        return (
          <Pressable
            key={deckSize}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={createDeckSizeAccessibilityLabel(deckSize)}
            onPress={() => onChange(deckSize)}
            style={[styles.option, isSelected && styles.selectedOption]}
          >
            <ThemedText style={[styles.optionText, isSelected && styles.selectedOptionText]}>
              {deckSize}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
