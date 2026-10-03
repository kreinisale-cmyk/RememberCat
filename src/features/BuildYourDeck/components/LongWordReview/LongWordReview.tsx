import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { LONG_WORD_REVIEW_COPY } from './constants';
import { styles } from './styles';
import { LongWordReviewProps } from './types';
import { createLongWordFindingLabel, createLongWordReviewConfirmLabel } from './utils';

export function LongWordReview({
  reviewPairs,
  isBatch = false,
  onCancel,
  onConfirm,
}: LongWordReviewProps) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText style={styles.kicker}>{LONG_WORD_REVIEW_COPY.kicker}</ThemedText>
          <ThemedText style={styles.title}>{LONG_WORD_REVIEW_COPY.title}</ThemedText>
        </View>
        <Pressable accessibilityLabel="Close word review" hitSlop={12} onPress={onCancel}>
          <ThemedText style={styles.close}>{LONG_WORD_REVIEW_COPY.close}</ThemedText>
        </Pressable>
      </View>
      <ThemedText style={styles.description}>{LONG_WORD_REVIEW_COPY.description}</ThemedText>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {reviewPairs.map((reviewPair) => (
          <View
            key={`${reviewPair.lineNumber ?? 'manual'}-${reviewPair.word}-${reviewPair.translation}`}
            style={styles.pairCard}
          >
            {reviewPair.lineNumber ? (
              <ThemedText style={styles.lineNumber}>
                {LONG_WORD_REVIEW_COPY.linePrefix} {reviewPair.lineNumber}
              </ThemedText>
            ) : null}
            <ThemedText style={styles.pairText}>
              {reviewPair.word} → {reviewPair.translation}
            </ThemedText>
            <View style={styles.findingList}>
              {reviewPair.findings.map((finding, findingIndex) => (
                <ThemedText
                  key={`${finding.field}-${finding.longWord}-${findingIndex}`}
                  style={styles.findingText}
                >
                  {createLongWordFindingLabel(finding.field)}:{' '}
                  <ThemedText style={styles.longWord}>{finding.longWord}</ThemedText> ·{' '}
                  {finding.characterCount} {LONG_WORD_REVIEW_COPY.characters}
                </ThemedText>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.confirmButton}>
          <ThemedText style={styles.confirmText}>
            {createLongWordReviewConfirmLabel(reviewPairs.length, isBatch)}
          </ThemedText>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onCancel} style={styles.editButton}>
          <ThemedText style={styles.editText}>{LONG_WORD_REVIEW_COPY.edit}</ThemedText>
        </Pressable>
      </View>
    </>
  );
}
