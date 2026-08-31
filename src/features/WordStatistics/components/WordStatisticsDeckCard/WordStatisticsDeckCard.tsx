import Cat from 'lucide-react-native/icons/cat';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import {
  ACCURACY_SUFFIX,
  NOT_PRACTICED_LABEL,
  PLAY_COUNT_SUFFIX,
  PLAY_COUNT_SUFFIX_SINGULAR,
} from './constants';
import { styles } from './styles';
import { WordStatisticsDeckCardProps } from './types';
import { createWordStatisticKey } from '../../utils';

export function WordStatisticsDeckCard({
  savedDeck,
  statisticLookup,
}: WordStatisticsDeckCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.catBadge}>
          <Cat color={RememberCatColors.secondaryForeground} size={20} strokeWidth={2.3} />
        </View>
        <View style={styles.headingCopy}>
          <ThemedText numberOfLines={2} style={styles.name}>
            {savedDeck.name}
          </ThemedText>
          <ThemedText style={styles.summary}>Best accuracy from completed games</ThemedText>
        </View>
        <ThemedText style={styles.count}>{savedDeck.pairCount} WORDS</ThemedText>
      </View>
      <View style={styles.wordList}>
        {savedDeck.pairs.map((wordPair) => {
          const wordStatistic = statisticLookup.get(
            createWordStatisticKey(savedDeck.id, wordPair.id),
          );

          if (!wordStatistic) {
            return (
              <View key={wordPair.id} style={styles.wordRow}>
                <View style={styles.wordCopy}>
                  <ThemedText numberOfLines={1} style={styles.word}>
                    {wordPair.word}
                  </ThemedText>
                  <ThemedText numberOfLines={1} style={styles.translation}>
                    {wordPair.translation}
                  </ThemedText>
                </View>
                <ThemedText style={styles.unplayed}>{NOT_PRACTICED_LABEL}</ThemedText>
              </View>
            );
          }

          const playCountSuffix =
            wordStatistic.completedGameCount === 1 ? PLAY_COUNT_SUFFIX_SINGULAR : PLAY_COUNT_SUFFIX;

          return (
            <View key={wordPair.id} style={styles.wordRowPracticed}>
              <View style={styles.wordLine}>
                <View style={styles.wordCopy}>
                  <ThemedText numberOfLines={1} style={styles.word}>
                    {wordPair.word}
                  </ThemedText>
                  <ThemedText numberOfLines={1} style={styles.translation}>
                    {wordPair.translation}
                  </ThemedText>
                </View>
                <View style={styles.metricCopy}>
                  <ThemedText style={styles.accuracy}>
                    {Math.round(wordStatistic.bestAccuracy)}
                    {ACCURACY_SUFFIX}
                  </ThemedText>
                  <ThemedText style={styles.plays}>
                    {wordStatistic.completedGameCount} {playCountSuffix}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.track}>
                <View
                  style={[styles.fill, { width: `${Math.min(wordStatistic.bestAccuracy, 100)}%` }]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
