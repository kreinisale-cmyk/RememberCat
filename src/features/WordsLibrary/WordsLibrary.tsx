import { Href, router, useLocalSearchParams } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Cat from 'lucide-react-native/icons/cat';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';
import { BuildYourDeckEntryMode, BuildYourDeckEntryOrigin } from '@/features/BuildYourDeck/types';
import { filterSavedDecksByDeckSize } from '@/features/BuildYourDeck/utils';
import { DeckSize } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';
import { DeckSizeSelector } from '@/features/GameSetup/components/DeckSizeSelector/DeckSizeSelector';

import { SavedWordListSection } from './components/SavedWordListSection/SavedWordListSection';
import {
  CREATE_LIST_LABEL,
  DELETE_CONFIRM_CANCEL_LABEL,
  DELETE_CONFIRM_LABEL,
  DELETE_CONFIRM_MESSAGE,
  DELETE_CONFIRM_TITLE,
  EMPTY_WORDS_COPY,
  GAME_ROUTE,
  START_GAME_LABEL,
  WORD_EDITOR_ROUTE,
  WORDS_COPY,
} from './constants';
import { styles } from './styles';
import { WordsLibraryRouteParams } from './types';
import { parseDeckSizeRouteParameter, parseRouteParameter } from './utils';

export function WordsLibrary() {
  const routeParams = useLocalSearchParams<WordsLibraryRouteParams>();
  const {
    draft,
    savedDecks,
    isSavedDeckLibraryLoading,
    savedDeckLibraryError,
    removeSavedDeck,
    startSavedDeckGame,
    updateDraft,
  } = useGameSession();
  const [selectedDeckSize, setSelectedDeckSize] = useState(() =>
    parseDeckSizeRouteParameter(routeParams.size, draft.deckSize),
  );
  const categorySavedDecks = useMemo(
    () => filterSavedDecksByDeckSize(savedDecks, selectedDeckSize),
    [savedDecks, selectedDeckSize],
  );
  const requestedSavedDeckId = parseRouteParameter(routeParams.selectedDeckId);
  const [selectedSavedDeckId, setSelectedSavedDeckId] = useState<string | null>(
    requestedSavedDeckId ?? null,
  );
  const activeSelectedSavedDeckId = categorySavedDecks.some(
    (savedDeck) => savedDeck.id === selectedSavedDeckId,
  )
    ? selectedSavedDeckId
    : (categorySavedDecks[0]?.id ?? null);

  useEffect(() => {
    setSelectedSavedDeckId((currentSelectedSavedDeckId) => {
      if (categorySavedDecks.some((savedDeck) => savedDeck.id === currentSelectedSavedDeckId)) {
        return currentSelectedSavedDeckId;
      }

      return categorySavedDecks[0]?.id ?? null;
    });
  }, [categorySavedDecks]);

  function changeDeckSize(deckSize: DeckSize) {
    setSelectedDeckSize(deckSize);
    setSelectedSavedDeckId(null);
  }

  function createWordList() {
    updateDraft({ deckSize: selectedDeckSize, pairs: [], savedDeckId: null });
    router.push({
      pathname: WORD_EDITOR_ROUTE,
      params: {
        mode: BuildYourDeckEntryMode.Create,
        origin: BuildYourDeckEntryOrigin.Words,
        size: String(selectedDeckSize),
      },
    } as unknown as Href);
  }

  function editWordList(savedDeckId: string) {
    router.push({
      pathname: WORD_EDITOR_ROUTE,
      params: {
        mode: BuildYourDeckEntryMode.Edit,
        origin: BuildYourDeckEntryOrigin.Words,
        savedDeckId,
        size: String(selectedDeckSize),
      },
    } as unknown as Href);
  }

  function confirmDeleteWordList(savedDeckId: string) {
    Alert.alert(DELETE_CONFIRM_TITLE, DELETE_CONFIRM_MESSAGE, [
      { text: DELETE_CONFIRM_CANCEL_LABEL, style: 'cancel' },
      {
        text: DELETE_CONFIRM_LABEL,
        style: 'destructive',
        onPress: () => void removeSavedDeck(savedDeckId),
      },
    ]);
  }

  function startSelectedWordList() {
    if (!activeSelectedSavedDeckId || !startSavedDeckGame(activeSelectedSavedDeckId)) {
      return;
    }

    router.push(GAME_ROUTE);
  }

  let libraryContent;

  if (isSavedDeckLibraryLoading) {
    libraryContent = <ThemedText style={styles.statusText}>{WORDS_COPY.loading}</ThemedText>;
  } else if (savedDeckLibraryError) {
    libraryContent = <ThemedText style={styles.statusText}>{savedDeckLibraryError}</ThemedText>;
  } else if (categorySavedDecks.length === 0) {
    libraryContent = (
      <View style={styles.emptyState}>
        <View style={styles.emptyCat}>
          <Cat color={RememberCatColors.secondaryForeground} size={40} strokeWidth={2} />
        </View>
        <ThemedText style={styles.emptyTitle}>{EMPTY_WORDS_COPY.title}</ThemedText>
        <ThemedText style={styles.emptyMessage}>{EMPTY_WORDS_COPY.message}</ThemedText>
      </View>
    );
  } else {
    libraryContent = (
      <View style={styles.listSections}>
        {categorySavedDecks.map((savedDeck) => (
          <SavedWordListSection
            key={savedDeck.id}
            savedDeck={savedDeck}
            isSelected={savedDeck.id === activeSelectedSavedDeckId}
            onDelete={confirmDeleteWordList}
            onEdit={editWordList}
            onSelect={setSelectedSavedDeckId}
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
          <ThemedText style={styles.kicker}>{WORDS_COPY.kicker}</ThemedText>
          <ThemedText style={styles.title}>{WORDS_COPY.title}</ThemedText>
          <ThemedText style={styles.intro}>{WORDS_COPY.intro}</ThemedText>
        </View>
        <View style={styles.selectorSection}>
          <ThemedText style={styles.selectorLabel}>{WORDS_COPY.category}</ThemedText>
          <DeckSizeSelector selectedDeckSize={selectedDeckSize} onChange={changeDeckSize} />
        </View>
        <View style={styles.library}>{libraryContent}</View>
        {!isSavedDeckLibraryLoading && !savedDeckLibraryError ? (
          <Pressable
            accessibilityRole="button"
            onPress={createWordList}
            style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.createText}>{CREATE_LIST_LABEL}</ThemedText>
          </Pressable>
        ) : null}
      </ScrollView>
      {activeSelectedSavedDeckId ? (
        <View style={styles.startBar}>
          <Pressable
            accessibilityRole="button"
            onPress={startSelectedWordList}
            style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.startText}>{START_GAME_LABEL}</ThemedText>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
