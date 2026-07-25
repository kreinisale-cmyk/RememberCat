import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FocusMode, MatchMode } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';
import { hasCompleteWordPairs } from '@/features/GameSession/utils';

import { ModeToggle } from './components/ModeToggle/ModeToggle';
import { SettingsCard } from './components/SettingsCard/SettingsCard';
import { GAME_SETUP_ROUTE, REQUIRED_WORD_PAIR_COUNT, WORDS_ROUTE } from './constants';
import { styles } from './styles';
import { getFocusModeDescription, getMatchModeDescription } from './utils';

export function GameSetup() {
  const { draft, startGameSession, updateDraft } = useGameSession();

  const isReady = hasCompleteWordPairs(draft, REQUIRED_WORD_PAIR_COUNT);

  const updateFocusMode = (focusMode: FocusMode) => {
    updateDraft({ focusMode });
  };
  const updateMatchMode = (matchMode: MatchMode) => {
    updateDraft({ matchMode });
  };
  const startGame = () => {
    if (isReady) {
      startGameSession();

      router.push(GAME_SETUP_ROUTE);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <ThemedText style={styles.back}>‹</ThemedText>
        </Pressable>
        <View>
          <ThemedText style={styles.kicker}>GAME SETUP</ThemedText>
          <ThemedText style={styles.title}>Your practice round</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.intro}>
        Choose how you’d like to play, then add the words you want to remember.
      </ThemedText>
      <View style={styles.cards}>
        <SettingsCard title="Focus mode" detail={getFocusModeDescription(draft.focusMode)}>
          <ModeToggle
            first={FocusMode.Timed}
            second={FocusMode.Free}
            selected={draft.focusMode}
            onChange={updateFocusMode}
          />
        </SettingsCard>
        <SettingsCard title="Match mode" detail={getMatchModeDescription(draft.matchMode)}>
          <ModeToggle
            first={MatchMode.Easy}
            second={MatchMode.Hard}
            selected={draft.matchMode}
            onChange={updateMatchMode}
          />
        </SettingsCard>
        <Pressable onPress={() => router.push(WORDS_ROUTE)} style={[styles.card, styles.wordsCard]}>
          <View style={styles.wordsIcon}>
            <ThemedText style={styles.wordsIconText}>✦</ThemedText>
          </View>
          <View style={styles.wordsCopy}>
            <ThemedText style={styles.cardTitle}>Generate words</ThemedText>
            <ThemedText style={styles.cardDetail}>
              {draft.pairs.length
                ? `${draft.pairs.length} of ${REQUIRED_WORD_PAIR_COUNT} word pairs added`
                : 'Add your own vocabulary'}
            </ThemedText>
          </View>
          <ThemedText style={styles.chevron}>›</ThemedText>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <ThemedText style={styles.footerHint}>
          {isReady
            ? 'Your deck is ready.'
            : `Add ${REQUIRED_WORD_PAIR_COUNT - draft.pairs.length} more word pairs to play.`}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={startGame}
          disabled={!isReady}
          style={[styles.startButton, !isReady && styles.startButtonDisabled]}
        >
          <ThemedText style={styles.startText}>Start game</ThemedText>
          <ThemedText style={styles.startArrow}>→</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
