import { KeyboardAvoidingView, Modal, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { BULK_WORD_PAIR_MODAL_COPY } from './constants';
import { styles } from './styles';
import { BulkWordPairModalProps } from './types';
import { createBulkWordPairModalDescription, getModalKeyboardBehavior } from './utils';

export function BulkWordPairModal({
  visible,
  contents,
  wordPairLimit,
  onChange,
  onClose,
  onSave,
}: BulkWordPairModalProps) {
  const canSave = Boolean(contents.trim());

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={getModalKeyboardBehavior()} style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.kicker}>{BULK_WORD_PAIR_MODAL_COPY.kicker}</ThemedText>
              <ThemedText style={styles.title}>{BULK_WORD_PAIR_MODAL_COPY.title}</ThemedText>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <ThemedText style={styles.close}>{BULK_WORD_PAIR_MODAL_COPY.close}</ThemedText>
            </Pressable>
          </View>
          <ThemedText style={styles.description}>
            {createBulkWordPairModalDescription(wordPairLimit)}
          </ThemedText>
          <TextInput
            autoFocus
            multiline
            value={contents}
            onChangeText={onChange}
            placeholder={BULK_WORD_PAIR_MODAL_COPY.placeholder}
            placeholderTextColor={BULK_WORD_PAIR_MODAL_COPY.placeholderTextColor}
            style={styles.input}
            textAlignVertical="top"
          />
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          >
            <ThemedText style={styles.saveText}>{BULK_WORD_PAIR_MODAL_COPY.save}</ThemedText>
            <ThemedText style={styles.saveArrow}>{BULK_WORD_PAIR_MODAL_COPY.arrow}</ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
