import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import {
  ADD_NEW_WORDS_LABEL,
  ADD_WORDS_ICON,
  CONTINUE_ARROW,
  CONTINUE_PRACTICE_HINT,
  CONTINUE_PRACTICE_LABEL,
  EDIT_WORD_LIST_LABEL,
  EDIT_WORDS_ICON,
  NAVIGATION_CHEVRON,
  SAVED_WORD_LISTS_LOADING_LABEL,
} from './constants';
import { styles } from './styles';
import { WordListSetupActionsProps } from './types';
import { createAddNewWordsDetail, createEditWordListDetail } from './utils';

export function WordListSetupActions({
  deckSize,
  latestSavedDeck,
  isLoading,
  errorMessage,
  onAdd,
  onContinue,
  onEdit,
}: WordListSetupActionsProps) {
  if (isLoading) {
    return (
      <View style={styles.status}>
        <ThemedText style={styles.statusText}>{SAVED_WORD_LISTS_LOADING_LABEL}</ThemedText>
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.status}>
        <ThemedText style={styles.statusText}>{errorMessage}</ThemedText>
      </View>
    );
  } else if (latestSavedDeck) {
    return (
      <>
        <Pressable accessibilityRole="button" onPress={onEdit} style={styles.card}>
          <View style={styles.icon}>
            <ThemedText style={styles.iconText}>{EDIT_WORDS_ICON}</ThemedText>
          </View>
          <View style={styles.copy}>
            <ThemedText style={styles.title}>{EDIT_WORD_LIST_LABEL}</ThemedText>
            <ThemedText numberOfLines={1} style={styles.detail}>
              {createEditWordListDetail(latestSavedDeck.name)}
            </ThemedText>
          </View>
          <ThemedText style={styles.chevron}>{NAVIGATION_CHEVRON}</ThemedText>
        </Pressable>
        <View style={styles.continueActions}>
          <ThemedText style={styles.continueHint}>{CONTINUE_PRACTICE_HINT}</ThemedText>
          <Pressable accessibilityRole="button" onPress={onContinue} style={styles.continueButton}>
            <ThemedText style={styles.continueText}>{CONTINUE_PRACTICE_LABEL}</ThemedText>
            <ThemedText style={styles.continueArrow}>{CONTINUE_ARROW}</ThemedText>
          </Pressable>
        </View>
      </>
    );
  } else {
    return (
      <Pressable accessibilityRole="button" onPress={onAdd} style={styles.card}>
        <View style={styles.icon}>
          <ThemedText style={styles.iconText}>{ADD_WORDS_ICON}</ThemedText>
        </View>
        <View style={styles.copy}>
          <ThemedText style={styles.title}>{ADD_NEW_WORDS_LABEL}</ThemedText>
          <ThemedText style={styles.detail}>{createAddNewWordsDetail(deckSize)}</ThemedText>
        </View>
        <ThemedText style={styles.chevron}>{NAVIGATION_CHEVRON}</ThemedText>
      </Pressable>
    );
  }
}
