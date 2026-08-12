import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { MistakeAnalyticsChart } from './components/MistakeAnalyticsChart/MistakeAnalyticsChart';
import {
  LEARNING_STATISTICS_KICKER,
  LEARNING_STATISTICS_TITLE,
  RETURN_TO_SETUP_BUTTON_LABEL,
} from './constants';
import { styles } from './styles';
import { LearningStatisticsProps } from './types';
import { createLearningStatisticsDescription } from './utils';

export function LearningStatistics({
  learningStatistics,
  practicePairCount,
  onReturnToSetup,
}: LearningStatisticsProps) {
  return (
    <View style={styles.content}>
      <View accessibilityRole="header" style={styles.header}>
        <ThemedText style={styles.kicker}>{LEARNING_STATISTICS_KICKER}</ThemedText>
        <ThemedText style={styles.title}>{LEARNING_STATISTICS_TITLE}</ThemedText>
        <ThemedText style={styles.description}>
          {createLearningStatisticsDescription(practicePairCount)}
        </ThemedText>
      </View>
      <MistakeAnalyticsChart learningStatistics={learningStatistics} />
      <Pressable accessibilityRole="button" onPress={onReturnToSetup} style={styles.button}>
        <ThemedText style={styles.buttonText}>{RETURN_TO_SETUP_BUTTON_LABEL}</ThemedText>
      </Pressable>
    </View>
  );
}
