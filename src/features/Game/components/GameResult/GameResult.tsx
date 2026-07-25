import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';

type GameResultProps = { score: number };
const MATCH_GOAL = 40;
const GAME_SETUP_ROUTE = '/game-setup';
const styles = StyleSheet.create({
  result: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#fff8f1',
  },
  title: { color: '#50342f', fontWeight: '800', fontSize: 36 },
  copy: { color: '#8e6d63', textAlign: 'center', fontSize: 16, marginTop: 12 },
  button: {
    marginTop: 28,
    borderRadius: 18,
    backgroundColor: '#50342f',
    paddingHorizontal: 25,
    paddingVertical: 16,
  },
  buttonText: { color: '#fff', fontWeight: '800' },
});

export function GameResult({ score }: GameResultProps) {
  const title = score >= MATCH_GOAL ? 'You did it!' : 'Time’s up!';
  return (
    <SafeAreaView style={styles.result}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.copy}>You made {score} matches.</ThemedText>
      <Pressable onPress={() => router.replace(GAME_SETUP_ROUTE)} style={styles.button}>
        <ThemedText style={styles.buttonText}>Build another round</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}
