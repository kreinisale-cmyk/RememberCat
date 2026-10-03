import { KeyboardAvoidingView, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { LONG_WORD_REVIEW_NOTICE } from '../../constants';
import { useLongWordReview } from '../../hooks/useLongWordReview';
import { BulkPasteStatus } from '../../types';
import { LongWordReview } from '../LongWordReview/LongWordReview';
import { BulkPasteIssues } from './components/BulkPasteIssues/BulkPasteIssues';
import { BULK_PASTE_STATUS_ICON, BULK_WORD_PAIR_MODAL_COPY } from './constants';
import { styles } from './styles';
import { BulkWordPairModalProps } from './types';
import {
  createBulkPasteSaveLabel,
  createBulkPasteStatusMessage,
  createBulkWordPairModalDescription,
  getModalKeyboardBehavior,
} from './utils';

export function BulkWordPairModal({
  visible,
  contents,
  analysis,
  recentlyAddedPairCount,
  wordPairLimit,
  onChange,
  onClose,
  onSave,
}: BulkWordPairModalProps) {
  const canSave = analysis.acceptedCandidates.length > 0;
  const { isReviewing, requestReview, cancelReview, confirmReview } = useLongWordReview(
    analysis.longWordReviewPairs,
  );
  let frameStyle: StyleProp<ViewStyle> = styles.inputFrameNeutral;
  let feedbackStyle: StyleProp<ViewStyle> = styles.feedbackNeutral;
  let iconStyle: StyleProp<TextStyle> = styles.statusIconNeutral;

  if (analysis.status === BulkPasteStatus.Error) {
    frameStyle = styles.inputFrameError;
    feedbackStyle = styles.feedbackError;
    iconStyle = styles.statusIconError;
  } else if (analysis.status === BulkPasteStatus.Warning) {
    frameStyle = styles.inputFrameWarning;
    feedbackStyle = styles.feedbackWarning;
    iconStyle = styles.statusIconWarning;
  } else if (analysis.status === BulkPasteStatus.Ready) {
    frameStyle = styles.inputFrameReady;
    feedbackStyle = styles.feedbackReady;
    iconStyle = styles.statusIconReady;
  }

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
              reviewPairs={analysis.longWordReviewPairs}
              isBatch
              onCancel={cancelReview}
              onConfirm={() => confirmReview(onSave)}
            />
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View>
                  <ThemedText style={styles.kicker}>{BULK_WORD_PAIR_MODAL_COPY.kicker}</ThemedText>
                  <ThemedText style={styles.title}>{BULK_WORD_PAIR_MODAL_COPY.title}</ThemedText>
                </View>
                <Pressable
                  accessibilityLabel="Close paste word list"
                  onPress={handleClose}
                  hitSlop={12}
                >
                  <ThemedText style={styles.close}>{BULK_WORD_PAIR_MODAL_COPY.close}</ThemedText>
                </Pressable>
              </View>
              <ThemedText style={styles.description}>
                {createBulkWordPairModalDescription(wordPairLimit)}
              </ThemedText>
              <View style={[styles.inputFrame, frameStyle]}>
                <View style={[styles.feedback, feedbackStyle]}>
                  <View style={styles.feedbackHeading}>
                    <ThemedText accessibilityElementsHidden style={[styles.statusIcon, iconStyle]}>
                      {BULK_PASTE_STATUS_ICON[analysis.status]}
                    </ThemedText>
                    <ThemedText
                      accessibilityLiveRegion="polite"
                      accessibilityRole="alert"
                      style={styles.statusMessage}
                    >
                      {createBulkPasteStatusMessage(analysis, recentlyAddedPairCount)}
                    </ThemedText>
                  </View>
                  <BulkPasteIssues visible={visible} lineResults={analysis.lineResults} />
                  {analysis.longWordReviewPairs.length ? (
                    <ThemedText accessibilityLiveRegion="polite" style={styles.reviewNotice}>
                      {LONG_WORD_REVIEW_NOTICE}
                    </ThemedText>
                  ) : null}
                </View>
                <TextInput
                  accessibilityLabel="Pasted word pairs"
                  autoFocus
                  multiline
                  value={contents}
                  onChangeText={onChange}
                  placeholder={BULK_WORD_PAIR_MODAL_COPY.placeholder}
                  placeholderTextColor={BULK_WORD_PAIR_MODAL_COPY.placeholderTextColor}
                  style={styles.input}
                  textAlignVertical="top"
                />
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={handleSave}
                disabled={!canSave}
                style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              >
                <ThemedText style={styles.saveText}>
                  {createBulkPasteSaveLabel(analysis)}
                </ThemedText>
                <ThemedText style={styles.saveArrow}>{BULK_WORD_PAIR_MODAL_COPY.arrow}</ThemedText>
              </Pressable>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
