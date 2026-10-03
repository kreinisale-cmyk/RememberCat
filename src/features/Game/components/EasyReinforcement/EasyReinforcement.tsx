import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { ReinforcementFeedback } from '../../types';
import { LearnedWordCelebration } from './components/LearnedWordCelebration/LearnedWordCelebration';
import {
  REINFORCEMENT_CLOSE_ACCESSIBILITY_LABEL,
  REINFORCEMENT_HINT,
  REINFORCEMENT_KICKER,
  REINFORCEMENT_SKIP_LABEL,
  REINFORCEMENT_TITLE,
  REPETITION_LABEL,
} from './constants';
import { styles } from './styles';
import { EasyReinforcementProps } from './types';
import {
  createReinforcementWordProgressLabel,
  getAnswerChoiceFeedback,
  getReinforcementProgress,
} from './utils';

export function EasyReinforcement({
  wordPair,
  answerChoices,
  currentWordNumber,
  totalWordCount,
  correctRepetitionCount,
  repetitionGoal,
  feedback,
  selectedAnswerId,
  isCelebrating,
  isSkipDisabled,
  onClose,
  onSelectAnswer,
  onSkip,
}: EasyReinforcementProps) {
  const progress = getReinforcementProgress(
    currentWordNumber,
    totalWordCount,
    correctRepetitionCount,
    repetitionGoal,
  );
  const isSelectionDisabled = feedback !== ReinforcementFeedback.None || isCelebrating;
  const isSkipButtonDisabled = isSelectionDisabled || isSkipDisabled;

  return (
    <View style={styles.content}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={REINFORCEMENT_CLOSE_ACCESSIBILITY_LABEL}
          onPress={onClose}
          style={styles.closeButton}
        >
          <ThemedText style={styles.close}>×</ThemedText>
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <ThemedText style={styles.progressLabel}>
          {createReinforcementWordProgressLabel(currentWordNumber, totalWordCount)}
        </ThemedText>
        <Pressable
          android_disableSound
          accessibilityRole="button"
          accessibilityLabel={REINFORCEMENT_SKIP_LABEL}
          accessibilityState={{ disabled: isSkipButtonDisabled }}
          disabled={isSkipButtonDisabled}
          onPress={onSkip}
          style={({ pressed }) => [
            styles.skipButton,
            isSkipButtonDisabled && styles.skipButtonDisabled,
            pressed && !isSkipButtonDisabled && styles.skipButtonPressed,
          ]}
        >
          <ThemedText style={styles.skipButtonText}>{REINFORCEMENT_SKIP_LABEL}</ThemedText>
        </Pressable>
      </View>
      <View accessibilityRole="header" style={styles.heading}>
        <ThemedText style={styles.kicker}>{REINFORCEMENT_KICKER}</ThemedText>
        <ThemedText style={styles.title}>{REINFORCEMENT_TITLE}</ThemedText>
        <ThemedText style={styles.hint}>{REINFORCEMENT_HINT}</ThemedText>
      </View>
      <View style={styles.board}>
        <View style={styles.promptColumn}>
          <View style={styles.promptCard}>
            <ThemedText style={styles.promptLabel}>WORD</ThemedText>
            <ThemedText adjustsFontSizeToFit numberOfLines={2} style={styles.promptWord}>
              {wordPair.word}
            </ThemedText>
          </View>
          <View style={styles.repetitionPill}>
            <ThemedText style={styles.repetitionText}>
              {correctRepetitionCount}/{repetitionGoal} {REPETITION_LABEL}
            </ThemedText>
          </View>
        </View>
        <View style={styles.answerColumn}>
          {answerChoices.map((answerChoice) => {
            const answerFeedback = getAnswerChoiceFeedback(
              answerChoice.wordPairId,
              selectedAnswerId,
              feedback,
            );

            return (
              <Pressable
                key={answerChoice.wordPairId}
                android_disableSound
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isSelectionDisabled,
                  selected: selectedAnswerId === answerChoice.wordPairId,
                }}
                disabled={isSelectionDisabled}
                onPress={() => onSelectAnswer(answerChoice.wordPairId)}
                style={({ pressed }) => [
                  styles.answer,
                  selectedAnswerId === answerChoice.wordPairId && styles.answerSelected,
                  answerFeedback === ReinforcementFeedback.Correct && styles.answerCorrect,
                  answerFeedback === ReinforcementFeedback.Incorrect && styles.answerIncorrect,
                  pressed && styles.answerPressed,
                ]}
              >
                <ThemedText numberOfLines={2} style={styles.answerText}>
                  {answerChoice.translation}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>
      {isCelebrating ? <LearnedWordCelebration word={wordPair.word} /> : null}
    </View>
  );
}
