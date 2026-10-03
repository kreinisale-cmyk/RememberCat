import { KeyboardAvoidingView, Modal, Pressable, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { LONG_WORD_REVIEW_NOTICE } from '../../constants';
import { useLongWordReview } from '../../hooks/useLongWordReview';
import { createLongWordReviewPair } from '../../utils';
import { LongWordReview } from '../LongWordReview/LongWordReview';
import { WORD_PAIR_MODAL_COPY } from './constants';
import { styles } from './styles';
import { WordPairModalProps } from './types';
import { getModalKeyboardBehavior } from './utils';

export function WordPairModal({
  visible,
  word,
  translation,
  canSave,
  errorMessage,
  onClose,
  onWordChange,
  onTranslationChange,
  onSave,
}: WordPairModalProps) {
  const reviewPair = canSave ? createLongWordReviewPair(word.trim(), translation.trim()) : null;
  const reviewPairs = reviewPair ? [reviewPair] : [];
  const { isReviewing, requestReview, cancelReview, confirmReview } =
    useLongWordReview(reviewPairs);

  function handleClose() {
    cancelReview();
    onClose();
  }

  function handleSave() {
    if (!canSave || requestReview()) return;

    onSave();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={isReviewing ? cancelReview : handleClose}
    >
      <KeyboardAvoidingView behavior={getModalKeyboardBehavior()} style={styles.backdrop}>
        <View style={styles.card}>
          {isReviewing ? (
            <LongWordReview
              reviewPairs={reviewPairs}
              onCancel={cancelReview}
              onConfirm={() => confirmReview(onSave)}
            />
          ) : (
            <>
              <View style={styles.header}>
                <View>
                  <ThemedText style={styles.kicker}>{WORD_PAIR_MODAL_COPY.kicker}</ThemedText>
                  <ThemedText style={styles.title}>{WORD_PAIR_MODAL_COPY.title}</ThemedText>
                </View>
                <Pressable onPress={handleClose} hitSlop={12}>
                  <ThemedText style={styles.close}>{WORD_PAIR_MODAL_COPY.close}</ThemedText>
                </Pressable>
              </View>
              <ThemedText style={styles.description}>{WORD_PAIR_MODAL_COPY.description}</ThemedText>
              <TextInput
                autoFocus
                value={word}
                onChangeText={onWordChange}
                placeholder={WORD_PAIR_MODAL_COPY.wordPlaceholder}
                placeholderTextColor={WORD_PAIR_MODAL_COPY.placeholderTextColor}
                style={styles.input}
                returnKeyType="next"
              />
              <TextInput
                value={translation}
                onChangeText={onTranslationChange}
                placeholder={WORD_PAIR_MODAL_COPY.translationPlaceholder}
                placeholderTextColor={WORD_PAIR_MODAL_COPY.placeholderTextColor}
                style={styles.input}
                onSubmitEditing={handleSave}
              />
              {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
              {reviewPairs.length ? (
                <ThemedText accessibilityLiveRegion="polite" style={styles.reviewNotice}>
                  {LONG_WORD_REVIEW_NOTICE}
                </ThemedText>
              ) : null}
              <Pressable
                onPress={handleSave}
                disabled={!canSave}
                style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              >
                <ThemedText style={styles.saveText}>
                  {reviewPairs.length
                    ? WORD_PAIR_MODAL_COPY.reviewAndSave
                    : WORD_PAIR_MODAL_COPY.save}
                </ThemedText>
                <ThemedText style={styles.saveArrow}>{WORD_PAIR_MODAL_COPY.arrow}</ThemedText>
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
