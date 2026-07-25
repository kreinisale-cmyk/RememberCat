import { ThemedText } from '@/components/themed-text';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';
import { FocusMode, MatchMode, WordPair } from '@/features/GameSession/types';
import { Redirect, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BOARD_SIZE,
  GAME_SETUP_ROUTE,
  INCORRECT_FEEDBACK_DURATION_MS,
  MATCH_FEEDBACK_DURATION_MS,
  MATCH_GOAL,
  TIMED_ROUND_SECONDS,
} from './constants';
import { GameResult } from './components/GameResult/GameResult';
import { MatchCard } from './components/MatchCard/MatchCard';
import { styles } from './styles';
import { MatchFeedback, SelectedPair } from './types';
import { formatClock, makeBoard, shuffle } from './utils';

export function Game() {
  const { session } = useGameSession();
  const [board, setBoard] = useState<WordPair[]>(() =>
    session ? makeBoard(session.pairs, BOARD_SIZE) : [],
  );
  const [cursor, setCursor] = useState(BOARD_SIZE);
  const [selection, setSelection] = useState<SelectedPair>({
    wordId: null,
    translationId: null,
  });

  const [feedback, setFeedback] = useState(MatchFeedback.None);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(TIMED_ROUND_SECONDS);
  const translations = useMemo(() => shuffle(board), [board]);
  const timed = session?.focusMode === FocusMode.Timed;

  useEffect(() => {
    if (!timed || score >= MATCH_GOAL) return;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [score, timed]);

  useEffect(() => {
    if (!session || !selection.wordId || !selection.translationId) return;
    const correct = selection.wordId === selection.translationId;
    setFeedback(correct ? MatchFeedback.Correct : MatchFeedback.Incorrect);

    const timeout = setTimeout(
      () => {
        if (correct) {
          setScore((value) => value + 1);

          setBoard((current) => {
            const nextPair = {
              ...session.pairs[cursor % session.pairs.length],
              id: `${session.pairs[cursor % session.pairs.length].id}-${cursor}`,
            };
            const next = current.map((pair) => (pair.id === selection.wordId ? nextPair : pair));
            return session.matchMode === MatchMode.Hard ? shuffle(next) : next;
          });

          setCursor((value) => value + 1);
        }
        setSelection({ wordId: null, translationId: null });

        setFeedback(MatchFeedback.None);
      },
      correct ? MATCH_FEEDBACK_DURATION_MS : INCORRECT_FEEDBACK_DURATION_MS,
    );
    return () => clearTimeout(timeout);
  }, [cursor, selection, session]);

  if (!session) return <Redirect href={GAME_SETUP_ROUTE} />;
  if (score >= MATCH_GOAL || (timed && seconds === 0)) return <GameResult score={score} />;

  const chooseWord = (id: string) =>
    feedback === MatchFeedback.None && setSelection((value) => ({ ...value, wordId: id }));

  const chooseTranslation = (id: string) =>
    feedback === MatchFeedback.None && setSelection((value) => ({ ...value, translationId: id }));

  const cardStyle = (id: string, isWord: boolean) =>
    feedback === MatchFeedback.Correct && id === selection.wordId
      ? styles.correct
      : feedback === MatchFeedback.Incorrect &&
          (isWord ? id === selection.wordId : id === selection.translationId)
        ? styles.incorrect
        : undefined;
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={styles.close}>×</ThemedText>
        </Pressable>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(score / MATCH_GOAL) * 100}%` }]} />
        </View>
        <ThemedText style={styles.score}>
          {score}/{MATCH_GOAL}
        </ThemedText>
      </View>
      <View style={styles.heading}>
        <ThemedText style={styles.kicker}>
          {timed ? `TIME LEFT ${formatClock(seconds)}` : 'PRACTICE MODE'}
        </ThemedText>
        <ThemedText style={styles.title}>Make the matches</ThemedText>
        <ThemedText style={styles.hint}>Tap a word, then its translation.</ThemedText>
      </View>
      <View style={styles.board}>
        <View style={styles.column}>
          {board.map((pair) => (
            <MatchCard
              key={pair.id}
              label={pair.word}
              selected={selection.wordId === pair.id}
              feedbackStyle={cardStyle(pair.id, true)}
              onPress={() => chooseWord(pair.id)}
            />
          ))}
        </View>
        <View style={styles.column}>
          {translations.map((pair) => (
            <MatchCard
              key={pair.id}
              label={pair.translation}
              selected={selection.translationId === pair.id}
              feedbackStyle={cardStyle(pair.id, false)}
              onPress={() => chooseTranslation(pair.id)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
