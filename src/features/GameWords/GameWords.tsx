import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { getSetupDraft, updateSetupDraft } from '@/lib/game-session';

import { WORD_PAIR_LIMIT } from './constants';
import { styles } from './styles';
import { WordPairField } from './types';
import { createWordPair, removeWordPair, updateWordPair } from './utils';

export function GameWords() {
  const [pairs, setPairs] = useState(() => getSetupDraft().pairs);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const isDeckFull = pairs.length >= WORD_PAIR_LIMIT;
  const canSavePair = Boolean(word.trim() && translation.trim());
  const setDraftPairs = (nextPairs: typeof pairs) => {
    setPairs(nextPairs);
    updateSetupDraft({ pairs: nextPairs });
  };
  const savePair = () => {
    if (canSavePair && !isDeckFull) {
      setDraftPairs([createWordPair(word, translation), ...pairs]);
      setWord('');
      setTranslation('');
      setIsModalVisible(false);
    }
  };
  const editPair = (id: string, field: WordPairField, value: string) =>
    setDraftPairs(updateWordPair(pairs, id, field, value));
  const deletePair = (id: string) => setDraftPairs(removeWordPair(pairs, id));

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
            pairs.map((pair, index) => (
              <View key={pair.id} style={styles.pairCard}>
                <View style={styles.pairHeader}>
                  <ThemedText style={styles.pairNumber}>WORD PAIR {index + 1}</ThemedText>
                  <Pressable onPress={() => deletePair(pair.id)} hitSlop={10}>
                    <ThemedText style={styles.remove}>Remove</ThemedText>
                  </Pressable>
                </View>
                <TextInput
                  value={pair.word}
                  onChangeText={(value) => editPair(pair.id, 'word', value)}
                  placeholder="Word in English"
                  placeholderTextColor="#bea89d"
                  style={styles.input}
                  returnKeyType="next"
                />
                <TextInput
                  value={pair.translation}
                  onChangeText={(value) => editPair(pair.id, 'translation', value)}
                  placeholder="Translation"
                  placeholderTextColor="#bea89d"
                  style={styles.input}
                />
              </View>
            ))
          )}
        </ScrollView>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          disabled={isDeckFull}
          style={[styles.addButton, isDeckFull && styles.addButtonDisabled]}
        >
          <ThemedText style={styles.addPlus}>+</ThemedText>
          <ThemedText style={styles.addText}>
            {isDeckFull ? `All ${WORD_PAIR_LIMIT} words added` : 'Add words'}
          </ThemedText>
        </Pressable>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EmptyDeck() {
  return (
    <View style={styles.empty}>
      <ThemedText style={styles.emptyIcon}>✦</ThemedText>
      <ThemedText style={styles.emptyTitle}>Your deck is empty</ThemedText>
      <ThemedText style={styles.emptyCopy}>Start with a word you’d love to remember.</ThemedText>
    </View>
  );
}
function WordPairModal({
  visible,
  word,
  translation,
  canSave,
  onClose,
  onWordChange,
  onTranslationChange,
  onSave,
}: {
  visible: boolean;
  word: string;
  translation: string;
  canSave: boolean;
  onClose: () => void;
  onWordChange: (value: string) => void;
  onTranslationChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <ThemedText style={styles.kicker}>NEW WORD PAIR</ThemedText>
              <ThemedText style={styles.modalTitle}>Add a word</ThemedText>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <ThemedText style={styles.close}>×</ThemedText>
            </Pressable>
          </View>
          <ThemedText style={styles.modalCopy}>
            Add the word and its translation. It will appear first in your deck.
          </ThemedText>
          <TextInput
            autoFocus
            value={word}
            onChangeText={onWordChange}
            placeholder="Word in English"
            placeholderTextColor="#bea89d"
            style={styles.modalInput}
            returnKeyType="next"
          />
          <TextInput
            value={translation}
            onChangeText={onTranslationChange}
            placeholder="Translation"
            placeholderTextColor="#bea89d"
            style={styles.modalInput}
            onSubmitEditing={onSave}
          />
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <ThemedText style={styles.saveText}>Add to deck</ThemedText>
            <ThemedText style={styles.saveArrow}>→</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
