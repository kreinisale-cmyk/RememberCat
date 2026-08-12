import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { BulkWordPairModal } from './components/BulkWordPairModal/BulkWordPairModal';
import { EmptyDeck } from './components/EmptyDeck/EmptyDeck';
import { WordListActions } from './components/WordListActions';
import { WordPairGrid } from './components/WordPairGrid';
import { WordPairModal } from './components/WordPairModal/WordPairModal';
import { GAME_ROUTE, WORD_PAIR_LIMIT } from './constants';
import { useBulkAddWordPairs } from './hooks/useBulkAddWordPairs';
import { useImportWordPairs } from './hooks/useImportWordPairs';
import { styles } from './styles';
import { WordPairField } from './types';
import { createWordPair, hasCompleteWordPair, removeWordPair, updateWordPair } from './utils';

export function BuildYourDeck() {
  const { draft, startGameSession, updateDraft } = useGameSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [bulkWords, setBulkWords] = useState('');

  const pairs = draft.pairs;
  const isDeckFull = pairs.length >= WORD_PAIR_LIMIT;
  const isDeckReady = isDeckFull && pairs.every(hasCompleteWordPair);
  const canSavePair = Boolean(word.trim() && translation.trim());
  const importWordPairs = useImportWordPairs({ pairs, setDraftPairs, setImportMessage });
  const addBulkWordPairs = useBulkAddWordPairs({ pairs, setDraftPairs, setImportMessage });

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

  function saveBulkWords() {
    if (!addBulkWordPairs(bulkWords)) return;

    setBulkWords('');
    setIsBulkModalVisible(false);
  }

  function startGame() {
    if (!isDeckReady) return;

    startGameSession();
    router.push(GAME_ROUTE);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <ThemedText style={styles.back}>‹</ThemedText>
          </Pressable>
          <View>
            <ThemedText style={styles.kicker}>YOUR WORDS</ThemedText>
            <ThemedText style={styles.title}>Build your deck</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.intro}>
          Add up to {WORD_PAIR_LIMIT} word pairs. Each one becomes a card in your matching game.
        </ThemedText>
        <View style={styles.count}>
          <ThemedText style={styles.countText}>
            {pairs.length} / {WORD_PAIR_LIMIT} pairs
          </ThemedText>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(pairs.length / WORD_PAIR_LIMIT) * 100}%` }]} />
          </View>
        </View>
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
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
          onChange={setBulkWords}
          onClose={() => setIsBulkModalVisible(false)}
          onSave={saveBulkWords}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
