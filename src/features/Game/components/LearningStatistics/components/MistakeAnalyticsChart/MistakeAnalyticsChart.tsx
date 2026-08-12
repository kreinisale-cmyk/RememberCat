import { useEffect, useRef } from 'react';
import { Animated, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { EMPTY_ANALYTICS_MESSAGE, MISTAKE_ANALYTICS_TITLE, MISTAKE_LABEL } from './constants';
import { styles } from './styles';
import { MistakeAnalyticsChartProps } from './types';
import {
  createMistakeBarWidth,
  createMistakeCountLabel,
  getHighestMismatchCount,
  selectMistakeStatistics,
} from './utils';

export function MistakeAnalyticsChart({ learningStatistics }: MistakeAnalyticsChartProps) {
  const chartAnimation = useRef(new Animated.Value(0)).current;
  const mistakeStatistics = selectMistakeStatistics(learningStatistics);
  const highestMismatchCount = getHighestMismatchCount(mistakeStatistics);

  useEffect(() => {
    Animated.timing(chartAnimation, {
      toValue: 1,
      duration: 650,
      useNativeDriver: false,
    }).start();
  }, [chartAnimation]);

  if (mistakeStatistics.length === 0) {
    return (
      <View accessible accessibilityLabel={EMPTY_ANALYTICS_MESSAGE} style={styles.emptyState}>
        <ThemedText style={styles.emptyCat}>😺</ThemedText>
        <ThemedText style={styles.emptyTitle}>Perfect memory!</ThemedText>
        <ThemedText style={styles.emptyMessage}>{EMPTY_ANALYTICS_MESSAGE}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <ThemedText style={styles.chartTitle}>{MISTAKE_ANALYTICS_TITLE}</ThemedText>
        <ThemedText style={styles.chartLegend}>{MISTAKE_LABEL}</ThemedText>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.chartScroll}
        contentContainerStyle={styles.chartContent}
      >
        {mistakeStatistics.map((wordStatistics) => (
          <View
            key={wordStatistics.id}
            accessible
            accessibilityLabel={`${wordStatistics.word}, ${createMistakeCountLabel(wordStatistics.mismatchCount)}`}
            style={styles.barRow}
          >
            <View style={styles.wordLine}>
              <ThemedText numberOfLines={1} style={styles.word}>
                {wordStatistics.word}
              </ThemedText>
              <ThemedText numberOfLines={1} style={styles.translation}>
                {wordStatistics.translation}
              </ThemedText>
              <ThemedText style={styles.count}>
                {createMistakeCountLabel(wordStatistics.mismatchCount)}
              </ThemedText>
            </View>
            <View style={styles.barTrack}>
              <Animated.View
                style={[
                  styles.barFill,
                  {
                    width: chartAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        '0%',
                        createMistakeBarWidth(wordStatistics.mismatchCount, highestMismatchCount),
                      ],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
