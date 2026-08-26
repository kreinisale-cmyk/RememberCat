import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { BulkWordPairModal } from './components/BulkWordPairModal/BulkWordPairModal';
import { EmptyDeck } from './components/EmptyDeck/EmptyDeck';
import { SavedDeckActions } from './components/SavedDeckActions/SavedDeckActions';
import { SavedDeckGrid } from './components/SavedDeckGrid/SavedDeckGrid';
import { WordListActions } from './components/WordListActions/WordListActions';
import { WordPairGrid } from './components/WordPairGrid';
import { WordPairModal } from './components/WordPairModal/WordPairModal';
import {
  CURRENT_DECK_HINT,
  CURRENT_DECK_TITLE,
  GAME_ROUTE,
  SAVED_DECK_LIBRARY_INTRO,
} from './constants';
import { useBulkAddWordPairs } from './hooks/useBulkAddWordPairs';
import { useImportWordPairs } from './hooks/useImportWordPairs';
import { styles } from './styles';
import {
  BuildYourDeckEntryMode,
  BuildYourDeckRouteParams,
  BuildYourDeckViewMode,
  WordPairField,
} from './types';
import {
  createWordPair,
  filterSavedDecksByDeckSize,
  hasCompleteWordPair,
  parseBuildYourDeckEntryMode,
  removeWordPair,
  updateWordPair,
} from './utils';

export function BuildYourDeck() {
  const routeParams = useLocalSearchParams<BuildYourDeckRouteParams>();
  const entryMode = parseBuildYourDeckEntryMode(routeParams.mode);
  const {
    draft,
    savedDecks,
    isSavedDeckLibraryLoading,
    savedDeckLibraryError,
    reuseSavedDeck,
    removeSavedDeck,
    startSavedDeckGame,
    startGameSession,
    updateDraft,
  } = useGameSession();

  const [viewMode, setViewMode] = useState(() =>
    entryMode === BuildYourDeckEntryMode.Create
      ? BuildYourDeckViewMode.Editor
      : BuildYourDeckViewMode.Library,
  );
  const [selectedSavedDeckId, setSelectedSavedDeckId] = useState<string | null>(null);
  const [editingSavedDeckId, setEditingSavedDeckId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [bulkWords, setBulkWords] = useState('');

  const pairs = draft.pairs;
  const wordPairLimit = draft.deckSize;
  const categorySavedDecks = useMemo(
    () => filterSavedDecksByDeckSize(savedDecks, wordPairLimit),
    [savedDecks, wordPairLimit],
  );
  const activeSelectedSavedDeckId = categorySavedDecks.some(
    (savedDeck) => savedDeck.id === selectedSavedDeckId,
  )
    ? selectedSavedDeckId
    : (categorySavedDecks[0]?.id ?? null);
  const isDeckFull = pairs.length >= wordPairLimit;
  const isDeckReady = pairs.length === wordPairLimit && pairs.every(hasCompleteWordPair);
  const canSavePair = Boolean(word.trim() && translation.trim());
  const isLibraryView = viewMode === BuildYourDeckViewMode.Library;
  const importWordPairs = useImportWordPairs({
    pairs,
    wordPairLimit,
    setDraftPairs,
    setImportMessage,
  });
  const addBulkWordPairs = useBulkAddWordPairs({
    pairs,
    wordPairLimit,
    setDraftPairs,
    setImportMessage,
  });

  useEffect(() => {
    if (entryMode === BuildYourDeckEntryMode.Create) {
      updateDraft({ pairs: [] });
      setEditingSavedDeckId(null);
      setSelectedSavedDeckId(null);
      setImportMessage('');
      setViewMode(BuildYourDeckViewMode.Editor);
    }
  }, [entryMode, updateDraft]);

  function setDraftPairs(nextPairs: typeof pairs) {
    updateDraft({ pairs: nextPairs });
  }

  function savePair() {
    if (!canSavePair || isDeckFull) return;

    setDraftPairs([createWordPair(word, translation), ...pairs]);
    setWord('');
    setTranslation('');
    setIsModalVisible(false);
  }

  function editPair(id: string, field: WordPairField, value: string) {
    setDraftPairs(updateWordPair(pairs, id, field, value));
  }

  function deletePair(id: string) {
    setDraftPairs(removeWordPair(pairs, id));
  }

  function editSavedDeck(savedDeckId: string) {
    if (!reuseSavedDeck(savedDeckId)) {
      return;
    }

    setEditingSavedDeckId(savedDeckId);
    setImportMessage('');
    setViewMode(BuildYourDeckViewMode.Editor);
  }

  function createNewDeck() {
    updateDraft({ pairs: [] });
    setEditingSavedDeckId(null);
    setImportMessage('');
    setViewMode(BuildYourDeckViewMode.Editor);
  }

  async function deleteSavedDeck(savedDeckId: string) {
    const wasDeleted = await removeSavedDeck(savedDeckId);

    if (wasDeleted && activeSelectedSavedDeckId === savedDeckId) {
      setSelectedSavedDeckId(null);
    }

    return wasDeleted;
  }

  function navigateBack() {
    if (viewMode === BuildYourDeckViewMode.Editor) {
      setViewMode(BuildYourDeckViewMode.Library);

      return;
    }

    router.back();
  }

  function saveBulkWords() {
    if (!addBulkWordPairs(bulkWords)) return;

    setBulkWords('');
    setIsBulkModalVisible(false);
  }

  async function startGame() {
    if (!isDeckReady) return;

    await startGameSession(editingSavedDeckId ?? undefined);
    router.push(GAME_ROUTE);
  }

  function startSelectedSavedDeck() {
    if (!activeSelectedSavedDeckId || !startSavedDeckGame(activeSelectedSavedDeckId)) {
      return;
    }

    router.push(GAME_ROUTE);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable onPress={navigateBack} hitSlop={12}>
            <ThemedText style={styles.back}>‹</ThemedText>
          </Pressable>
          <View>
            <ThemedText style={styles.kicker}>YOUR WORDS</ThemedText>
            <ThemedText style={styles.title}>Build your deck</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.intro}>
          {isLibraryView
            ? SAVED_DECK_LIBRARY_INTRO
            : `Add ${wordPairLimit} word pairs. Each one becomes a card in your matching game.`}
        </ThemedText>
        {isLibraryView ? (
          <>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              <SavedDeckGrid
                savedDecks={categorySavedDecks}
                isLoading={isSavedDeckLibraryLoading}
                errorMessage={savedDeckLibraryError}
                selectedSavedDeckId={activeSelectedSavedDeckId}
                onSelect={setSelectedSavedDeckId}
                onEdit={editSavedDeck}
                onDelete={deleteSavedDeck}
                onCreate={createNewDeck}
              />
            </ScrollView>
            {!isSavedDeckLibraryLoading &&
            !savedDeckLibraryError &&
            categorySavedDecks.length > 0 ? (
              <SavedDeckActions
                hasSelectedDeck={Boolean(activeSelectedSavedDeckId)}
                onStart={startSelectedSavedDeck}
              />
            ) : null}
          </>
        ) : (
          <>
            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              <View style={styles.currentDeckHeading}>
                <ThemedText style={styles.currentDeckTitle}>{CURRENT_DECK_TITLE}</ThemedText>
                <ThemedText style={styles.currentDeckHint}>{CURRENT_DECK_HINT}</ThemedText>
              </View>
              <View style={styles.count}>
                <ThemedText style={styles.countText}>
                  {pairs.length} / {wordPairLimit} pairs
                </ThemedText>
                <View style={styles.track}>
                  <View
                    style={[styles.fill, { width: `${(pairs.length / wordPairLimit) * 100}%` }]}
                  />
                </View>
              </View>
              {pairs.length === 0 ? (
                <EmptyDeck />
              ) : (
                <WordPairGrid pairs={pairs} onEdit={editPair} onRemove={deletePair} />
              )}
            </ScrollView>
            <WordListActions
              isDeckFull={isDeckFull}
              isDeckReady={isDeckReady}
              importMessage={importMessage}
              onAdd={() => setIsModalVisible(true)}
              onImport={importWordPairs}
              onPaste={() => setIsBulkModalVisible(true)}
              onStart={startGame}
            />
          </>
        )}
        <WordPairModal
          visible={isModalVisible}
          word={word}
          translation={translation}
          canSave={canSavePair}
          onClose={() => setIsModalVisible(false)}
          onWordChange={setWord}
          onTranslationChange={setTranslation}
          onSave={savePair}
        />
        <BulkWordPairModal
          visible={isBulkModalVisible}
          contents={bulkWords}
          wordPairLimit={wordPairLimit}
          onChange={setBulkWords}
          onClose={() => setIsBulkModalVisible(false)}
          onSave={saveBulkWords}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
