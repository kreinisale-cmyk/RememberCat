import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  IMPORT_WORDS_LABEL,
  PASTE_WORDS_LABEL,
  START_GAME_ARROW,
  START_GAME_LABEL,
  WORD_LIST_FORMAT_HINT,
} from './constants';
import { styles } from './styles';
import { WordListActionsProps } from './types';
import { createAddWordsLabel } from './utils';

export function WordListActions({
  isDeckFull,
  isDeckReady,
  importMessage,
  onAdd,
  onImport,
  onPaste,
  onStart,
}: WordListActionsProps) {
  return (
    <>
      <View style={styles.wordActionsRow}>
        <Pressable
          onPress={onAdd}
          disabled={isDeckFull}
          style={[styles.wordActionButton, isDeckFull && styles.wordActionButtonDisabled]}
        >
          <ThemedText style={styles.addPlus}>+</ThemedText>
          <ThemedText numberOfLines={1} style={styles.wordActionText}>
            {createAddWordsLabel(isDeckFull)}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={onPaste}
          disabled={isDeckFull}
          style={[styles.wordActionButton, isDeckFull && styles.wordActionButtonDisabled]}
        >
          <ThemedText numberOfLines={1} style={styles.wordActionText}>
            {PASTE_WORDS_LABEL}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={onImport}
          disabled={isDeckFull}
          style={[styles.wordActionButton, isDeckFull && styles.wordActionButtonDisabled]}
        >
          <ThemedText numberOfLines={1} style={styles.wordActionText}>
            {IMPORT_WORDS_LABEL}
          </ThemedText>
        </Pressable>
      </View>
      <ThemedText style={styles.importHint}>{WORD_LIST_FORMAT_HINT}</ThemedText>
      {importMessage ? <ThemedText style={styles.importMessage}>{importMessage}</ThemedText> : null}
      {isDeckReady ? (
        <Pressable onPress={onStart} style={styles.startGameButton}>
          <ThemedText style={styles.startGameText}>{START_GAME_LABEL}</ThemedText>
          <ThemedText style={styles.startGameArrow}>{START_GAME_ARROW}</ThemedText>
        </Pressable>
      ) : null}
    </>
  );
}
