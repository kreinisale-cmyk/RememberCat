import ArrowRight from 'lucide-react-native/icons/arrow-right';
import Cat from 'lucide-react-native/icons/cat';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import Pencil from 'lucide-react-native/icons/pencil';
import Trash2 from 'lucide-react-native/icons/trash-2';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { DELETE_LABEL, EDIT_LABEL, WORD_COUNT_SUFFIX } from './constants';
import { styles } from './styles';
import { SavedWordListSectionProps } from './types';

export function SavedWordListSection({
  savedDeck,
  isSelected,
  onDelete,
  onEdit,
  onSelect,
}: SavedWordListSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  function selectWordList() {
    onSelect(savedDeck.id);
  }

  function editWordList() {
    onEdit(savedDeck.id);
  }

  function deleteWordList() {
    onDelete(savedDeck.id);
  }

  function togglePreview() {
    setIsExpanded((currentValue) => !currentValue);
  }

  return (
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        onPress={selectWordList}
        style={({ pressed }) => [styles.selectButton, pressed && styles.pressed]}
      >
        <View style={[styles.catBadge, isSelected && styles.catBadgeSelected]}>
          <Cat
            color={
              isSelected
                ? RememberCatColors.primaryForeground
                : RememberCatColors.secondaryForeground
            }
            size={20}
            strokeWidth={2.3}
          />
        </View>
        <View style={styles.headingCopy}>
          <ThemedText numberOfLines={2} style={styles.name}>
            {savedDeck.name}
          </ThemedText>
          <ThemedText style={styles.count}>
            {savedDeck.pairCount} {WORD_COUNT_SUFFIX}
          </ThemedText>
        </View>
        {isSelected ? <ThemedText style={styles.selectedBadge}>SELECTED</ThemedText> : null}
      </Pressable>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={editWordList}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Pencil color={RememberCatColors.foreground} size={14} strokeWidth={2.6} />
          <ThemedText style={styles.actionText}>{EDIT_LABEL}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={deleteWordList}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        >
          <Trash2 color={RememberCatColors.destructive} size={14} strokeWidth={2.6} />
          <ThemedText style={styles.deleteText}>{DELETE_LABEL}</ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          onPress={togglePreview}
          style={({ pressed }) => [styles.previewButton, pressed && styles.pressed]}
        >
          <ThemedText style={styles.previewText}>{isExpanded ? 'Hide' : 'Preview'}</ThemedText>
          <ChevronDown
            color={RememberCatColors.mutedForeground}
            size={16}
            strokeWidth={2.6}
            style={isExpanded ? styles.chevronExpanded : undefined}
          />
        </Pressable>
      </View>
      {isExpanded ? (
        <View style={styles.wordList}>
          {savedDeck.pairs.map((wordPair, index) => (
            <View key={wordPair.id} style={styles.wordRow}>
              <ThemedText style={styles.wordNumber}>{index + 1}</ThemedText>
              <ThemedText numberOfLines={1} style={styles.word}>
                {wordPair.word}
              </ThemedText>
              <ArrowRight color={RememberCatColors.primaryMuted} size={15} strokeWidth={2.4} />
              <ThemedText numberOfLines={1} style={styles.translation}>
                {wordPair.translation}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
