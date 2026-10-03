import { Href, router, useLocalSearchParams } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';
import { StartGameSessionStatus } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { BulkWordPairModal } from './components/BulkWordPairModal/BulkWordPairModal';
import { DeckNameField } from './components/DeckNameField/DeckNameField';
import { EmptyDeck } from './components/EmptyDeck/EmptyDeck';
import { SavedDeckActions } from './components/SavedDeckActions/SavedDeckActions';
import { SavedDeckGrid } from './components/SavedDeckGrid/SavedDeckGrid';
import { WordListActions } from './components/WordListActions/WordListActions';
import { WordPairGrid } from './components/WordPairGrid/WordPairGrid';
import { WordPairModal } from './components/WordPairModal/WordPairModal';
import {
  CURRENT_DECK_HINT,
  CURRENT_DECK_TITLE,
  DECK_SAVE_ERROR_MESSAGE,
  DUPLICATE_DECK_MESSAGE,
  DUPLICATE_PAIR_MESSAGE,
  GAME_ROUTE,
  GAME_SETUP_ROUTE,
  MAX_DECK_NAME_LENGTH,
  REQUIRED_DECK_NAME_MESSAGE,
  SAVED_DECK_LIBRARY_INTRO,
  WORDS_ROUTE,
} from './constants';
import { useBulkAddWordPairs } from './hooks/useBulkAddWordPairs';
import { useImportWordPairs } from './hooks/useImportWordPairs';
import { styles } from './styles';
import {
  BuildYourDeckEntryMode,
  BuildYourDeckEntryOrigin,
  BuildYourDeckRouteParams,
  BuildYourDeckViewMode,
  WordPairField,
} from './types';
import {
  analyzeBulkWordPairPaste,
  createWordPair,
  filterSavedDecksByDeckSize,
  findCandidateWordPairConflict,
  findWordPairConflicts,
  hasCompleteWordPair,
  parseBuildYourDeckEntryMode,
  parseBuildYourDeckEntryOrigin,
  parseSingleRouteParameter,
  removeWordPair,
  updateWordPair,
} from './utils';

export function BuildYourDeck() {
  const routeParams = useLocalSearchParams<BuildYourDeckRouteParams>();
  const entryMode = parseBuildYourDeckEntryMode(routeParams.mode);
  const entryOrigin = parseBuildYourDeckEntryOrigin(routeParams.origin);
  const routeSavedDeckId = parseSingleRouteParameter(routeParams.savedDeckId);
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
    entryMode === BuildYourDeckEntryMode.Create || entryMode === BuildYourDeckEntryMode.Edit
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
  const [recentlyAddedBulkPairCount, setRecentlyAddedBulkPairCount] = useState(0);
  const [deckName, setDeckName] = useState('');
  const [wordPairModalError, setWordPairModalError] = useState<string | null>(null);

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
  const wordPairConflicts = useMemo(() => findWordPairConflicts(pairs), [pairs]);
  const candidateWordPair = useMemo(
    () => ({ id: 'candidate', word, translation }),
    [translation, word],
  );
  const hasCandidateConflict = findCandidateWordPairConflict(pairs, candidateWordPair);
  const hasValidDeckName = Boolean(deckName.trim());
  const isDeckReady =
    pairs.length === wordPairLimit &&
    pairs.every(hasCompleteWordPair) &&
    wordPairConflicts.length === 0 &&
    hasValidDeckName;
  const canSavePair = Boolean(word.trim() && translation.trim() && !hasCandidateConflict);
  const bulkPasteAnalysis = useMemo(
    () => analyzeBulkWordPairPaste(bulkWords, pairs, wordPairLimit),
    [bulkWords, pairs, wordPairLimit],
  );
  const isLibraryView = viewMode === BuildYourDeckViewMode.Library;
  const importWordPairs = useImportWordPairs({
    pairs,
    wordPairLimit,
    setDraftPairs,
    setImportMessage,
  });
  const addBulkWordPairs = useBulkAddWordPairs({
    pairs,
    setDraftPairs,
    setImportMessage,
  });

  useEffect(() => {
    if (entryMode === BuildYourDeckEntryMode.Create) {
      updateDraft({ pairs: [], savedDeckId: null });
      setEditingSavedDeckId(null);
      setSelectedSavedDeckId(null);
      setImportMessage('');
      setDeckName('');
      setViewMode(BuildYourDeckViewMode.Editor);
    }
  }, [entryMode, updateDraft]);

  useEffect(() => {
    if (entryMode !== BuildYourDeckEntryMode.Edit || !routeSavedDeckId) {
      return;
    }

    if (reuseSavedDeck(routeSavedDeckId)) {
      const savedDeck = savedDecks.find((candidateDeck) => candidateDeck.id === routeSavedDeckId);

      setEditingSavedDeckId(routeSavedDeckId);
      setSelectedSavedDeckId(routeSavedDeckId);
      setDeckName(savedDeck?.name ?? '');
      setImportMessage('');
      setViewMode(BuildYourDeckViewMode.Editor);
    }
  }, [entryMode, reuseSavedDeck, routeSavedDeckId, savedDecks]);

  function setDraftPairs(nextPairs: typeof pairs) {
    updateDraft({ pairs: nextPairs });
  }

  function savePair() {
    if (hasCandidateConflict) {
      setWordPairModalError(DUPLICATE_PAIR_MESSAGE);

      return;
    }

    if (!canSavePair || isDeckFull) return;

    setDraftPairs([createWordPair(word, translation), ...pairs]);
    setWord('');
    setTranslation('');
    setIsModalVisible(false);
    setWordPairModalError(null);
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
    setDeckName(savedDecks.find((savedDeck) => savedDeck.id === savedDeckId)?.name ?? '');
    setImportMessage('');
    setViewMode(BuildYourDeckViewMode.Editor);
  }

  function createNewDeck() {
    updateDraft({ pairs: [], savedDeckId: null });
    setEditingSavedDeckId(null);
    setDeckName('');
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
      if (
        entryMode === BuildYourDeckEntryMode.Create &&
        entryOrigin === BuildYourDeckEntryOrigin.GameSetup &&
        pairs.length === 0
      ) {
        router.replace(GAME_SETUP_ROUTE);

        return;
      }

      router.replace({
        pathname: WORDS_ROUTE,
        params: {
          size: String(draft.deckSize),
          selectedDeckId: editingSavedDeckId ?? undefined,
        },
      } as unknown as Href);

      return;
    }

    router.back();
  }

  function saveBulkWords() {
    const result = addBulkWordPairs(bulkPasteAnalysis);

    if (!result.addedPairCount) return;

    setRecentlyAddedBulkPairCount(result.addedPairCount);

    if (result.remainingContents) {
      setBulkWords(result.remainingContents);

      return;
    }

    setBulkWords('');
    setIsBulkModalVisible(false);
  }

  function changeBulkWords(value: string) {
    setBulkWords(value);
    setRecentlyAddedBulkPairCount(0);
  }

  function openBulkWordPairModal() {
    setRecentlyAddedBulkPairCount(0);
    setIsBulkModalVisible(true);
  }

  async function startGame() {
    if (!isDeckReady) return;

    const result = await startGameSession({
      deckName: deckName.trim(),
      savedDeckId: editingSavedDeckId ?? undefined,
    });

    if (result.status === StartGameSessionStatus.Started) {
      router.push(GAME_ROUTE);
    } else if (result.status === StartGameSessionStatus.DuplicateDeck) {
      setImportMessage(DUPLICATE_DECK_MESSAGE);
    } else {
      setImportMessage(DECK_SAVE_ERROR_MESSAGE);
    }
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
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={12}
            onPress={navigateBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <ArrowLeft color={RememberCatColors.foreground} size={20} strokeWidth={2.4} />
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
              <DeckNameField
                name={deckName}
                errorMessage={hasValidDeckName ? null : REQUIRED_DECK_NAME_MESSAGE}
                maxLength={MAX_DECK_NAME_LENGTH}
                onChange={setDeckName}
              />
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
                <WordPairGrid
                  conflicts={wordPairConflicts}
                  pairs={pairs}
                  onEdit={editPair}
                  onRemove={deletePair}
                />
              )}
            </ScrollView>
            <WordListActions
              isDeckFull={isDeckFull}
              isDeckReady={isDeckReady}
              importMessage={importMessage}
              onAdd={() => setIsModalVisible(true)}
              onImport={importWordPairs}
              onPaste={openBulkWordPairModal}
              onStart={startGame}
            />
          </>
        )}
        <WordPairModal
          visible={isModalVisible}
          word={word}
          translation={translation}
          canSave={canSavePair}
          errorMessage={hasCandidateConflict ? DUPLICATE_PAIR_MESSAGE : wordPairModalError}
          onClose={() => setIsModalVisible(false)}
          onWordChange={(value) => {
            setWord(value);
            setWordPairModalError(null);
          }}
          onTranslationChange={(value) => {
            setTranslation(value);
            setWordPairModalError(null);
          }}
          onSave={savePair}
        />
        <BulkWordPairModal
          visible={isBulkModalVisible}
          contents={bulkWords}
          analysis={bulkPasteAnalysis}
          recentlyAddedPairCount={recentlyAddedBulkPairCount}
          wordPairLimit={wordPairLimit}
          onChange={changeBulkWords}
          onClose={() => setIsBulkModalVisible(false)}
          onSave={saveBulkWords}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
