import Clock from 'lucide-react-native/icons/clock';
import SettingsIcon from 'lucide-react-native/icons/settings';
import Volume2 from 'lucide-react-native/icons/volume-2';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';
import { useAppPreferences } from '@/features/AppPreferences/useAppPreferences/useAppPreferences';
import { FocusMode } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { GameFeedbackSettings } from './components/GameFeedbackSettings/GameFeedbackSettings';
import { ModeToggle } from './components/ModeToggle/ModeToggle';
import { SettingsCard } from './components/SettingsCard/SettingsCard';
import { SettingsCardIconTone } from './components/SettingsCard/types';
import { SETTINGS_HEADER_ICON_SIZE, SETTINGS_SCREEN_COPY } from './constants';
import { styles } from './styles';
import { getFocusModeDescription } from './utils';

export function Settings() {
  const {
    preferences,
    isPreferencesLoading,
    preferencesError,
    setCatReactionsEnabled,
    setGameCuesEnabled,
    setHapticsEnabled,
  } = useAppPreferences();
  const { draft, updateDraft } = useGameSession();

  function updateFocusMode(focusMode: FocusMode) {
    updateDraft({ focusMode });
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brandBadge}>
            <SettingsIcon
              color={RememberCatColors.primary}
              size={SETTINGS_HEADER_ICON_SIZE}
              strokeWidth={2.2}
            />
          </View>
          <ThemedText style={styles.kicker}>{SETTINGS_SCREEN_COPY.kicker}</ThemedText>
          <ThemedText style={styles.title}>{SETTINGS_SCREEN_COPY.title}</ThemedText>
          <ThemedText style={styles.intro}>{SETTINGS_SCREEN_COPY.intro}</ThemedText>
        </View>
        <View style={styles.cards}>
          <SettingsCard
            icon={Clock}
            iconTone={SettingsCardIconTone.Secondary}
            title={SETTINGS_SCREEN_COPY.focusModeTitle}
            detail={getFocusModeDescription(draft.focusMode)}
          >
            <ModeToggle
              first={FocusMode.Timed}
              second={FocusMode.Free}
              selected={draft.focusMode}
              onChange={updateFocusMode}
            />
          </SettingsCard>
          <SettingsCard
            icon={Volume2}
            title={SETTINGS_SCREEN_COPY.gameFeedbackTitle}
            detail={SETTINGS_SCREEN_COPY.gameFeedbackDetail}
          >
            <GameFeedbackSettings
              catReactionsEnabled={preferences.catReactionsEnabled}
              gameCuesEnabled={preferences.gameCuesEnabled}
              hapticsEnabled={preferences.hapticsEnabled}
              isDisabled={isPreferencesLoading}
              errorMessage={preferencesError}
              onCatReactionsEnabledChange={setCatReactionsEnabled}
              onGameCuesEnabledChange={setGameCuesEnabled}
              onHapticsEnabledChange={setHapticsEnabled}
            />
          </SettingsCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
