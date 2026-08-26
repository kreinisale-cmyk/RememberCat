import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { START_GAME_ARROW, START_GAME_LABEL } from './constants';
import { styles } from './styles';
import { SavedDeckActionsProps } from './types';
import { createSavedDeckActionHint } from './utils';

export function SavedDeckActions({ hasSelectedDeck, onStart }: SavedDeckActionsProps) {
  return (
    <View style={styles.actions}>
      <ThemedText style={styles.hint}>{createSavedDeckActionHint(hasSelectedDeck)}</ThemedText>
      <Pressable
        accessibilityRole="button"
        disabled={!hasSelectedDeck}
        onPress={onStart}
        style={[styles.startButton, !hasSelectedDeck && styles.startButtonDisabled]}
      >
        <ThemedText style={styles.startText}>{START_GAME_LABEL}</ThemedText>
        <ThemedText style={styles.startArrow}>{START_GAME_ARROW}</ThemedText>
      </Pressable>
    </View>
  );
}
