import { useState } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  DELETE_SAVED_DECK_ICON,
  DELETING_SAVED_DECK_ICON,
  EDIT_SAVED_DECK_ICON,
  SAVED_DECK_WORD_COUNT_SUFFIX,
} from './constants';
import { styles } from './styles';
import { SavedDeckCardProps } from './types';
import {
  createDeleteSavedDeckAccessibilityLabel,
  createEditSavedDeckAccessibilityLabel,
  createSavedDeckAccessibilityLabel,
  createSavedDeckPreview,
} from './utils';

export function SavedDeckCard({
  savedDeck,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: SavedDeckCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const showActions = isHovered || isSelected;

  function editSavedDeck(event: GestureResponderEvent) {
    event.stopPropagation();
    onEdit(savedDeck.id);
  }

  async function deleteSavedDeck(event: GestureResponderEvent) {
    event.stopPropagation();

    if (isDeleting) {
      return;
    }

    setIsDeleting(true);
    const wasDeleted = await onDelete(savedDeck.id);

    if (!wasDeleted) {
      setIsDeleting(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={createSavedDeckAccessibilityLabel(savedDeck)}
      accessibilityState={{ selected: isSelected }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => onSelect(savedDeck.id)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardTop}>
        <ThemedText style={styles.count}>
          {savedDeck.pairCount} {SAVED_DECK_WORD_COUNT_SUFFIX}
        </ThemedText>
        {showActions ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={createEditSavedDeckAccessibilityLabel(savedDeck.name)}
              onPress={editSavedDeck}
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            >
              <ThemedText style={styles.editIcon}>{EDIT_SAVED_DECK_ICON}</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={createDeleteSavedDeckAccessibilityLabel(savedDeck.name)}
              accessibilityState={{ disabled: isDeleting }}
              disabled={isDeleting}
              onPress={deleteSavedDeck}
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            >
              <ThemedText style={styles.deleteIcon}>
                {isDeleting ? DELETING_SAVED_DECK_ICON : DELETE_SAVED_DECK_ICON}
              </ThemedText>
            </Pressable>
          </View>
        ) : null}
      </View>
      <ThemedText numberOfLines={2} style={[styles.name, isSelected && styles.nameSelected]}>
        {savedDeck.name}
      </ThemedText>
      <ThemedText numberOfLines={3} style={[styles.preview, isSelected && styles.previewSelected]}>
        {createSavedDeckPreview(savedDeck)}
      </ThemedText>
    </Pressable>
  );
}
