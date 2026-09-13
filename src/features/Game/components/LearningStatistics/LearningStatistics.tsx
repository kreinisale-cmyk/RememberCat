import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { MistakeAnalyticsChart } from './components/MistakeAnalyticsChart/MistakeAnalyticsChart';
import { MasteryWordList } from './components/MasteryWordList/MasteryWordList';
import { ResultSummary } from './components/ResultSummary/ResultSummary';
import {
  LEARNING_STATISTICS_KICKER,
  LEARNING_STATISTICS_TITLE,
  REVIEW_COMPLETE_LABEL,
  REVIEW_MISSED_WORDS_BUTTON_LABEL,
  RETURN_TO_SETUP_BUTTON_LABEL,
} from './constants';
import { styles } from './styles';
import { LearningStatisticsProps } from './types';
import { createLearningStatisticsDescription } from './utils';
import { FocusedReviewState } from '../../types';

export function LearningStatistics({
  result,
  focusedReviewState,
  onReviewMissedWords,
  onReturnToSetup,
}: LearningStatisticsProps) {
  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View accessibilityRole="header" style={styles.header}>
        <ThemedText style={styles.kicker}>{LEARNING_STATISTICS_KICKER}</ThemedText>
        <ThemedText style={styles.title}>{LEARNING_STATISTICS_TITLE}</ThemedText>
        <ThemedText style={styles.description}>
          {createLearningStatisticsDescription(result.missedWordPairIds.length)}
        </ThemedText>
      </View>
      <ResultSummary result={result} />
      <MistakeAnalyticsChart learningStatistics={result.learningStatistics} />
      <MasteryWordList wordResults={result.wordResults} />
      {focusedReviewState === FocusedReviewState.Available ? (
        <Pressable
          accessibilityRole="button"
          onPress={onReviewMissedWords}
          style={styles.reviewButton}
        >
          <ThemedText style={styles.reviewButtonText}>
            {REVIEW_MISSED_WORDS_BUTTON_LABEL}
          </ThemedText>
        </Pressable>
      ) : null}
      {focusedReviewState === FocusedReviewState.Complete ? (
        <View accessible style={styles.reviewComplete}>
          <ThemedText style={styles.reviewCompleteText}>{REVIEW_COMPLETE_LABEL}</ThemedText>
        </View>
      ) : null}
      <Pressable accessibilityRole="button" onPress={onReturnToSetup} style={styles.returnButton}>
        <ThemedText style={styles.returnButtonText}>{RETURN_TO_SETUP_BUTTON_LABEL}</ThemedText>
      </Pressable>
    </ScrollView>
  );
}
