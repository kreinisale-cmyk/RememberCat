import { Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { ANSWER_SOUNDS_COPY, GAME_CUES_COPY, HAPTICS_COPY } from './constants';
import { styles } from './styles';
import { GameFeedbackSettingsProps } from './types';

export function GameFeedbackSettings({
  catReactionsEnabled,
  gameCuesEnabled,
  hapticsEnabled,
  isDisabled,
  errorMessage,
  onCatReactionsEnabledChange,
  onGameCuesEnabledChange,
  onHapticsEnabledChange,
}: GameFeedbackSettingsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <ThemedText style={styles.label}>{ANSWER_SOUNDS_COPY.label}</ThemedText>
          <ThemedText style={styles.hint}>{ANSWER_SOUNDS_COPY.hint}</ThemedText>
        </View>
        <Switch
          accessibilityHint={ANSWER_SOUNDS_COPY.hint}
          accessibilityLabel={ANSWER_SOUNDS_COPY.label}
          accessibilityRole="switch"
          accessibilityState={{ checked: catReactionsEnabled, disabled: isDisabled }}
          disabled={isDisabled}
          onValueChange={onCatReactionsEnabledChange}
          thumbColor={RememberCatColors.card}
          trackColor={{
            false: RememberCatColors.border,
            true: RememberCatColors.primary,
          }}
          value={catReactionsEnabled}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.copy}>
          <ThemedText style={styles.label}>{GAME_CUES_COPY.label}</ThemedText>
          <ThemedText style={styles.hint}>{GAME_CUES_COPY.hint}</ThemedText>
        </View>
        <Switch
          accessibilityHint={GAME_CUES_COPY.hint}
          accessibilityLabel={GAME_CUES_COPY.label}
          accessibilityRole="switch"
          accessibilityState={{ checked: gameCuesEnabled, disabled: isDisabled }}
          disabled={isDisabled}
          onValueChange={onGameCuesEnabledChange}
          thumbColor={RememberCatColors.card}
          trackColor={{
            false: RememberCatColors.border,
            true: RememberCatColors.primary,
          }}
          value={gameCuesEnabled}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.copy}>
          <ThemedText style={styles.label}>{HAPTICS_COPY.label}</ThemedText>
          <ThemedText style={styles.hint}>{HAPTICS_COPY.hint}</ThemedText>
        </View>
        <Switch
          accessibilityHint={HAPTICS_COPY.hint}
          accessibilityLabel={HAPTICS_COPY.label}
          accessibilityRole="switch"
          accessibilityState={{ checked: hapticsEnabled, disabled: isDisabled }}
          disabled={isDisabled}
          onValueChange={onHapticsEnabledChange}
          thumbColor={RememberCatColors.card}
          trackColor={{
            false: RememberCatColors.border,
            true: RememberCatColors.primary,
          }}
          value={hapticsEnabled}
        />
      </View>
      {errorMessage ? <ThemedText style={styles.error}>{errorMessage}</ThemedText> : null}
    </View>
  );
}
