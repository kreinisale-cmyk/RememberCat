import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { EMPTY_DECK_COPY } from './constants';
import { styles } from './styles';

export function EmptyDeck() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.icon}>{EMPTY_DECK_COPY.icon}</ThemedText>
      <ThemedText style={styles.title}>{EMPTY_DECK_COPY.title}</ThemedText>
      <ThemedText style={styles.description}>{EMPTY_DECK_COPY.description}</ThemedText>
    </View>
  );
}
