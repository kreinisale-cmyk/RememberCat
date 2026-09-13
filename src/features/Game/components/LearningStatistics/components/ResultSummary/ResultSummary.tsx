import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { ACCURACY_LABEL, CORRECT_LABEL, MISTAKES_LABEL } from './constants';
import { styles } from './styles';
import { ResultSummaryProps } from './types';

export function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.primaryMetric}>
        <ThemedText style={styles.primaryValue}>{result.assessmentAccuracy}%</ThemedText>
        <ThemedText style={styles.primaryLabel}>{ACCURACY_LABEL}</ThemedText>
      </View>
      <View style={styles.metric}>
        <ThemedText style={styles.value}>{result.assessmentCorrectAttemptCount}</ThemedText>
        <ThemedText style={styles.label}>{CORRECT_LABEL}</ThemedText>
      </View>
      <View style={styles.metric}>
        <ThemedText style={styles.value}>{result.totalIncorrectAttemptCount}</ThemedText>
        <ThemedText style={styles.label}>{MISTAKES_LABEL}</ThemedText>
      </View>
    </View>
  );
}
