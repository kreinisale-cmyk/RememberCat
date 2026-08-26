import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { SavedDeckCard } from './components/SavedDeckCard/SavedDeckCard';
import {
  CREATE_DECK_LABEL,
  CREATE_DECK_SYMBOL,
  SAVED_DECK_EMPTY_LABEL,
  SAVED_DECK_GRID_HINT,
  SAVED_DECK_GRID_TITLE,
  SAVED_DECK_LOADING_LABEL,
} from './constants';
import { styles } from './styles';
import { SavedDeckGridProps } from './types';

export function SavedDeckGrid({
  savedDecks,
  isLoading,
  errorMessage,
  selectedSavedDeckId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: SavedDeckGridProps) {
  let gridContent;

  if (isLoading) {
    gridContent = (
      <View style={styles.statusCard}>
        <ThemedText style={styles.statusText}>{SAVED_DECK_LOADING_LABEL}</ThemedText>
      </View>
    );
  } else if (errorMessage) {
    gridContent = (
      <View style={styles.statusCard}>
        <ThemedText style={styles.statusText}>{errorMessage}</ThemedText>
      </View>
    );
  } else if (savedDecks.length === 0) {
    gridContent = (
      <View style={styles.statusCard}>
        <ThemedText style={styles.statusText}>{SAVED_DECK_EMPTY_LABEL}</ThemedText>
      </View>
    );
  } else {
    gridContent = (
      <View style={styles.grid}>
        {savedDecks.map((savedDeck) => (
          <SavedDeckCard
            key={savedDeck.id}
            savedDeck={savedDeck}
            isSelected={savedDeck.id === selectedSavedDeckId}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <ThemedText style={styles.title}>{SAVED_DECK_GRID_TITLE}</ThemedText>
      <ThemedText style={styles.hint}>{SAVED_DECK_GRID_HINT}</ThemedText>
      {gridContent}
      <Pressable accessibilityRole="button" onPress={onCreate} style={styles.createButton}>
        <ThemedText style={styles.createSymbol}>{CREATE_DECK_SYMBOL}</ThemedText>
        <ThemedText style={styles.createLabel}>{CREATE_DECK_LABEL}</ThemedText>
      </Pressable>
    </View>
  );
}
