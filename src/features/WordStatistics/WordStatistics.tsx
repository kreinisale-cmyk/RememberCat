import { router } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Cat from 'lucide-react-native/icons/cat';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';
import { filterSavedDecksByDeckSize } from '@/features/BuildYourDeck/utils';
import { DeckSize } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';
import { DeckSizeSelector } from '@/features/GameSetup/components/DeckSizeSelector/DeckSizeSelector';

import { WordStatisticsDeckCard } from './components/WordStatisticsDeckCard/WordStatisticsDeckCard';
import { EMPTY_STATISTICS_COPY, STATISTICS_COPY } from './constants';
import { styles } from './styles';
import { createWordStatisticLookup } from './utils';

export function WordStatistics() {
  const {
    draft,
    savedDecks,
    isSavedDeckLibraryLoading,
    savedDeckLibraryError,
    wordStatistics,
    isWordStatisticsLoading,
    wordStatisticsError,
  } = useGameSession();
  const [selectedDeckSize, setSelectedDeckSize] = useState(draft.deckSize);
  const categorySavedDecks = useMemo(
    () => filterSavedDecksByDeckSize(savedDecks, selectedDeckSize),
    [savedDecks, selectedDeckSize],
  );
  const wordStatisticLookup = useMemo(
    () => createWordStatisticLookup(wordStatistics),
    [wordStatistics],
  );
  const isLoading = isSavedDeckLibraryLoading || isWordStatisticsLoading;
  const errorMessage = savedDeckLibraryError ?? wordStatisticsError;

  function changeDeckSize(deckSize: DeckSize) {
    setSelectedDeckSize(deckSize);
  }

  let statisticsContent;

  if (isLoading) {
    statisticsContent = (
      <ThemedText style={styles.statusText}>{STATISTICS_COPY.loading}</ThemedText>
    );
  } else if (errorMessage) {
    statisticsContent = <ThemedText style={styles.statusText}>{errorMessage}</ThemedText>;
  } else if (categorySavedDecks.length === 0) {
    statisticsContent = (
      <View style={styles.emptyState}>
        <View style={styles.emptyCat}>
          <Cat color={RememberCatColors.secondaryForeground} size={40} strokeWidth={2} />
        </View>
        <ThemedText style={styles.emptyTitle}>{EMPTY_STATISTICS_COPY.title}</ThemedText>
        <ThemedText style={styles.emptyMessage}>{EMPTY_STATISTICS_COPY.message}</ThemedText>
      </View>
    );
  } else {
    statisticsContent = (
      <View style={styles.deckList}>
        {categorySavedDecks.map((savedDeck) => (
          <WordStatisticsDeckCard
            key={savedDeck.id}
            savedDeck={savedDeck}
            statisticLookup={wordStatisticLookup}
          />
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => router.back()}
              style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
            >
              <ArrowLeft color={RememberCatColors.foreground} size={20} strokeWidth={2.4} />
            </Pressable>
            <View style={styles.brandBadge}>
              <Cat color={RememberCatColors.primary} size={22} strokeWidth={2.2} />
            </View>
          </View>
          <ThemedText style={styles.kicker}>{STATISTICS_COPY.kicker}</ThemedText>
          <ThemedText style={styles.title}>{STATISTICS_COPY.title}</ThemedText>
          <ThemedText style={styles.intro}>{STATISTICS_COPY.intro}</ThemedText>
        </View>
        <View style={styles.selectorSection}>
          <ThemedText style={styles.selectorLabel}>{STATISTICS_COPY.category}</ThemedText>
          <DeckSizeSelector selectedDeckSize={selectedDeckSize} onChange={changeDeckSize} />
        </View>
        <View style={styles.statistics}>{statisticsContent}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
