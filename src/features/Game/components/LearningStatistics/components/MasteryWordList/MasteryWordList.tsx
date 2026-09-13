import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { MASTERY_SECTION_TITLE } from './constants';
import { styles } from './styles';
import { MasteryWordListProps } from './types';
import { createMasteryChangeLabel, createWordAttemptLabel } from './utils';

export function MasteryWordList({ wordResults }: MasteryWordListProps) {
  return (
    <View style={styles.card}>
      <ThemedText style={styles.title}>{MASTERY_SECTION_TITLE}</ThemedText>
      <View style={styles.list}>
        {wordResults.map((wordResult) => (
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
    </View>
  );
}
