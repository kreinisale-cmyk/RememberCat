import ChevronRight from 'lucide-react-native/icons/chevron-right';
import Pencil from 'lucide-react-native/icons/pencil';
import Plus from 'lucide-react-native/icons/plus';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import {
  ADD_NEW_WORDS_LABEL,
  CONTINUE_PRACTICE_HINT,
  CONTINUE_PRACTICE_LABEL,
  EDIT_WORD_LIST_LABEL,
  SAVED_WORD_LISTS_LOADING_LABEL,
  WORD_LIST_ACTION_ICON_SIZE,
  WORD_LIST_CHEVRON_SIZE,
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
      <View style={styles.section}>
        <Pressable
          accessibilityRole="button"
          onPress={onEdit}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          <View style={styles.icon}>
            <Pencil
              color={RememberCatColors.secondaryForeground}
              size={WORD_LIST_ACTION_ICON_SIZE}
              strokeWidth={2.4}
            />
          </View>
          <View style={styles.copy}>
            <ThemedText style={styles.title}>{EDIT_WORD_LIST_LABEL}</ThemedText>
            <ThemedText numberOfLines={1} style={styles.detail}>
              {createEditWordListDetail(latestSavedDeck.name)}
            </ThemedText>
          </View>
          <ChevronRight
            color={RememberCatColors.mutedForeground}
            size={WORD_LIST_CHEVRON_SIZE}
            strokeWidth={2.4}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [styles.continueButton, pressed && styles.cardPressed]}
        >
          <ThemedText style={styles.continueText}>{CONTINUE_PRACTICE_LABEL}</ThemedText>
        </Pressable>
        <ThemedText style={styles.continueHint}>{CONTINUE_PRACTICE_HINT}</ThemedText>
      </View>
    );
  } else {
    return (
      <View style={styles.section}>
        <Pressable
          accessibilityRole="button"
          onPress={onAdd}
          style={({ pressed }) => [styles.emptyCard, pressed && styles.cardPressed]}
        >
          <View style={styles.addIcon}>
            <Plus
              color={RememberCatColors.primaryForeground}
              size={WORD_LIST_ACTION_ICON_SIZE}
              strokeWidth={2.6}
            />
          </View>
          <View style={styles.copy}>
            <ThemedText style={styles.title}>{ADD_NEW_WORDS_LABEL}</ThemedText>
            <ThemedText style={styles.detail}>{createAddNewWordsDetail(deckSize)}</ThemedText>
          </View>
          <ChevronRight
            color={RememberCatColors.mutedForeground}
            size={WORD_LIST_CHEVRON_SIZE}
            strokeWidth={2.4}
          />
        </Pressable>
      </View>
    );
  }
}
