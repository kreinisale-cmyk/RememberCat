import { Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { WordPair } from '@/features/GameSession/types';

import { styles } from '../styles';
import { WordPairField } from '../types';

type WordPairGridProps = {
  pairs: WordPair[];
  onEdit: (id: string, field: WordPairField, value: string) => void;
  onRemove: (id: string) => void;
};

export function WordPairGrid({ pairs, onEdit, onRemove }: WordPairGridProps) {
  return (
    <View style={styles.pairGrid}>
      {pairs.map((pair, index) => (
        <View key={pair.id} style={styles.pairCard}>
          <View style={styles.pairHeader}>
            <ThemedText style={styles.pairNumber}>PAIR {index + 1}</ThemedText>
            <Pressable onPress={() => onRemove(pair.id)} hitSlop={10}>
              <ThemedText style={styles.remove}>Remove</ThemedText>
            </Pressable>
          </View>
          <TextInput
            value={pair.word}
            onChangeText={(value) => onEdit(pair.id, 'word', value)}
            placeholder="Word"
            placeholderTextColor="#bea89d"
            style={styles.input}
            returnKeyType="next"
          />
          <TextInput
            value={pair.translation}
            onChangeText={(value) => onEdit(pair.id, 'translation', value)}
            placeholder="Translation"
            placeholderTextColor="#bea89d"
            style={styles.input}
          />
        </View>
      ))}
    </View>
  );
}
