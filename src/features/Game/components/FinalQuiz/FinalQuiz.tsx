import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { FinalQuizFeedback } from '../../types';
import { FinalQuizAnswerOption } from './components/FinalQuizAnswerOption/FinalQuizAnswerOption';
import { FinalQuizSuccessAnimation } from './components/FinalQuizSuccessAnimation/FinalQuizSuccessAnimation';
import { FINAL_QUIZ_CLOSE_ACCESSIBILITY_LABEL, FINAL_QUIZ_PROMPT_LABEL } from './constants';
import { styles } from './styles';
import { FinalQuizProps } from './types';
import { createFinalQuizProgressLabel, createFinalQuizProgressWidth } from './utils';

export function FinalQuiz({
  questionWordPair,
  answerChoices,
  feedback,
  selectedAnswerId,
  passedWordPairCount,
  totalWordPairCount,
  onClose,
  onSelectAnswer,
}: FinalQuizProps) {
  const isAnswerInputDisabled = feedback !== FinalQuizFeedback.None;

  return (
    <View style={styles.content}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={FINAL_QUIZ_CLOSE_ACCESSIBILITY_LABEL}
          onPress={onClose}
          style={styles.closeButton}
        >
          <ThemedText style={styles.close}>×</ThemedText>
        </Pressable>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {
                width: createFinalQuizProgressWidth(passedWordPairCount, totalWordPairCount),
              },
            ]}
          />
        </View>
        <ThemedText style={styles.progressLabel}>
          {createFinalQuizProgressLabel(passedWordPairCount, totalWordPairCount)}
        </ThemedText>
      </View>
      <View style={styles.quizBody}>
        <View accessibilityRole="header" style={styles.question}>
          <ThemedText style={styles.promptLabel}>{FINAL_QUIZ_PROMPT_LABEL}</ThemedText>
          <ThemedText numberOfLines={1} adjustsFontSizeToFit style={styles.promptWord}>
            {questionWordPair.word}
          </ThemedText>
        </View>
        <View style={styles.answerGrid}>
          {answerChoices.map((answerChoice) => {
            const isSelectedAnswer = selectedAnswerId === answerChoice.wordPairId;

            return (
              <FinalQuizAnswerOption
                key={answerChoice.wordPairId}
                label={answerChoice.translation}
                disabled={isAnswerInputDisabled}
                isCorrect={isSelectedAnswer && feedback === FinalQuizFeedback.Correct}
                isIncorrect={isSelectedAnswer && feedback === FinalQuizFeedback.Miss}
                onPress={() => onSelectAnswer(answerChoice.wordPairId)}
              />
            );
          })}
        </View>
      </View>
      {feedback === FinalQuizFeedback.Correct ? <FinalQuizSuccessAnimation /> : null}
    </View>
  );
}
