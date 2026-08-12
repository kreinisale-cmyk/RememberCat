import { Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { WORD_PAIR_LIMIT } from '../constants';
import { styles } from '../styles';

type WordListActionsProps = {
  isDeckFull: boolean;
  isDeckReady: boolean;
  importMessage: string;
  onAdd: () => void;
  onImport: () => void;
  onPaste: () => void;
  onStart: () => void;
};
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
      <Pressable
        onPress={onAdd}
        disabled={isDeckFull}
        style={[styles.addButton, isDeckFull && styles.addButtonDisabled]}
      >
        <ThemedText style={styles.addPlus}>+</ThemedText>
        <ThemedText style={styles.addText}>
          {isDeckFull ? `All ${WORD_PAIR_LIMIT} words added` : 'Add words'}
        </ThemedText>
      </Pressable>
      <Pressable onPress={onImport} disabled={isDeckFull} style={styles.importButton}>
        <ThemedText style={styles.importText}>Import word list</ThemedText>
      </Pressable>
      <Pressable onPress={onPaste} disabled={isDeckFull} style={styles.importButton}>
        <ThemedText style={styles.importText}>Paste a word list</ThemedText>
      </Pressable>
      <ThemedText style={styles.importHint}>
        File format: word - translation (one pair per line)
      </ThemedText>
      {importMessage ? <ThemedText style={styles.importMessage}>{importMessage}</ThemedText> : null}
      {isDeckReady ? (
        <Pressable onPress={onStart} style={styles.startGameButton}>
          <ThemedText style={styles.startGameText}>Start game</ThemedText>
          <ThemedText style={styles.startGameArrow}>→</ThemedText>
        </Pressable>
      ) : null}
    </>
  );
}
