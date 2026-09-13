import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { DUPLICATE_FIELD_MESSAGE, REMOVE_PAIR_LABEL } from './constants';
import { styles } from './styles';
import { WordPairGridProps } from './types';
import { hasFieldConflict } from './utils';
import { WordPairField } from '../../types';

export function WordPairGrid({ conflicts, pairs, onEdit, onRemove }: WordPairGridProps) {
  return (
    <View style={styles.grid}>
      {pairs.map((pair, index) => {
        const hasWordConflict = hasFieldConflict(conflicts, pair.id, WordPairField.Word);
        const hasTranslationConflict = hasFieldConflict(
          conflicts,
          pair.id,
          WordPairField.Translation,
        );

        return (
          <View key={pair.id} style={styles.card}>
            <View style={styles.header}>
              <ThemedText style={styles.number}>PAIR {index + 1}</ThemedText>
              <Pressable onPress={() => onRemove(pair.id)} hitSlop={10}>
                <ThemedText style={styles.remove}>{REMOVE_PAIR_LABEL}</ThemedText>
              </Pressable>
            </View>
            <TextInput
              value={pair.word}
              onChangeText={(value) => onEdit(pair.id, WordPairField.Word, value)}
              placeholder="Word"
              placeholderTextColor={RememberCatColors.mutedForeground}
              style={[styles.input, hasWordConflict && styles.inputConflict]}
              returnKeyType="next"
            />
            {hasWordConflict ? (
              <ThemedText style={styles.error}>{DUPLICATE_FIELD_MESSAGE}</ThemedText>
            ) : null}
            <TextInput
              value={pair.translation}
              onChangeText={(value) => onEdit(pair.id, WordPairField.Translation, value)}
              placeholder="Translation"
              placeholderTextColor={RememberCatColors.mutedForeground}
              style={[styles.input, hasTranslationConflict && styles.inputConflict]}
            />
            {hasTranslationConflict ? (
              <ThemedText style={styles.error}>{DUPLICATE_FIELD_MESSAGE}</ThemedText>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
