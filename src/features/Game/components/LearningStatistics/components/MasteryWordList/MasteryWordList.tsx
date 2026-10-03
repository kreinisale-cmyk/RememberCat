import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  MASTERY_COLLAPSED_WORD_COUNT,
  MASTERY_COLLAPSE_LABEL,
  MASTERY_SECTION_TITLE,
} from './constants';
import { styles } from './styles';
import { MasteryWordListProps } from './types';
import {
  createMasteryExpandLabel,
  createMasteryChangeLabel,
  createWordAttemptLabel,
  selectVisibleMasteryWordResults,
} from './utils';

export function MasteryWordList({ wordResults }: MasteryWordListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleWordResults = selectVisibleMasteryWordResults(
    wordResults,
    MASTERY_COLLAPSED_WORD_COUNT,
    isExpanded,
  );
  const isExpansionAvailable = wordResults.length > MASTERY_COLLAPSED_WORD_COUNT;

  function toggleExpansion() {
    setIsExpanded((currentIsExpanded) => !currentIsExpanded);
  }

  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>{MASTERY_SECTION_TITLE}</ThemedText>
      <View style={styles.list}>
        {visibleWordResults.map((wordResult) => (
          <View key={wordResult.wordPair.id} style={styles.row}>
            <View style={styles.copy}>
              <ThemedText numberOfLines={1} style={styles.word}>
                {wordResult.wordPair.word}
              </ThemedText>
              <ThemedText numberOfLines={1} style={styles.translation}>
                {wordResult.wordPair.translation}
              </ThemedText>
              <ThemedText style={styles.attempts}>{createWordAttemptLabel(wordResult)}</ThemedText>
            </View>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>
                {createMasteryChangeLabel(wordResult)}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
      {isExpansionAvailable ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          onPress={toggleExpansion}
          style={({ pressed }) => [styles.expandButton, pressed && styles.expandButtonPressed]}
        >
          <ThemedText style={styles.expandButtonText}>
            {isExpanded ? MASTERY_COLLAPSE_LABEL : createMasteryExpandLabel(wordResults.length)}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}
