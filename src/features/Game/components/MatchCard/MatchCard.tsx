import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';

type MatchCardProps = {
  label: string;
  selected: boolean;
  feedbackStyle?: StyleProp<ViewStyle>;
  onPress: () => void;
};
const styles = StyleSheet.create({
  card: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#efdcd0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  selected: { backgroundColor: '#f4d1b5', borderColor: '#df8a73' },
  text: { fontSize: 14, color: '#5d4038', fontWeight: '700' },
});

export function MatchCard({ label, selected, feedbackStyle, onPress }: MatchCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Match option: ${label}`}
      onPress={onPress}
      style={[styles.card, selected && styles.selected, feedbackStyle]}
    >
      <ThemedText numberOfLines={1} style={styles.text}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
