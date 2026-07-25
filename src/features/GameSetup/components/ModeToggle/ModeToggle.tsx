import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FocusMode, MatchMode } from '@/features/GameSession/types';

import { MODE_TOGGLE_ACCESSIBILITY_ROLE } from './constants';
import { styles } from './styles';
import { ModeToggleProps } from './types';
import { isSelectedMode } from './utils';

export function ModeToggle<T extends FocusMode | MatchMode>({
  first,
  second,
  selected,
  onChange,
}: ModeToggleProps<T>) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole={MODE_TOGGLE_ACCESSIBILITY_ROLE}
        onPress={() => onChange(first)}
        style={[styles.option, isSelectedMode(first, selected) && styles.selectedOption]}
      >
        <ThemedText style={[styles.text, isSelectedMode(first, selected) && styles.selectedText]}>
          {first}
        </ThemedText>
      </Pressable>
      <Pressable
        accessibilityRole={MODE_TOGGLE_ACCESSIBILITY_ROLE}
        onPress={() => onChange(second)}
        style={[styles.option, isSelectedMode(second, selected) && styles.selectedOption]}
      >
        <ThemedText style={[styles.text, isSelectedMode(second, selected) && styles.selectedText]}>
          {second}
        </ThemedText>
      </Pressable>
    </View>
  );
}
