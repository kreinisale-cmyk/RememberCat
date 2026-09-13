import { TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { DECK_NAME_LABEL, DECK_NAME_PLACEHOLDER } from './constants';
import { styles } from './styles';
import { DeckNameFieldProps } from './types';

export function DeckNameField({ name, errorMessage, maxLength, onChange }: DeckNameFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>{DECK_NAME_LABEL}</ThemedText>
        <ThemedText style={styles.count}>
          {name.length}/{maxLength}
        </ThemedText>
      </View>
      <TextInput
        accessibilityLabel={DECK_NAME_LABEL}
        maxLength={maxLength}
        onChangeText={onChange}
        placeholder={DECK_NAME_PLACEHOLDER}
        placeholderTextColor={RememberCatColors.mutedForeground}
        returnKeyType="done"
        style={[styles.input, errorMessage && styles.inputError]}
        value={name}
      />
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
    </View>
  );
}
