import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { FocusMode, MatchMode } from '@/features/GameSession/types';
import { getSetupDraft, setGameSession, updateSetupDraft } from '@/lib/game-session';

import { GAME_SETUP_ROUTE, REQUIRED_WORD_PAIR_COUNT, WORDS_ROUTE } from './constants';
import { styles } from './styles';
import { ModeToggleProps } from './types';
import { getFocusModeDescription, getMatchModeDescription } from './utils';

export function GameSetup() {
  const [draft, setDraft] = useState(getSetupDraft());
  useFocusEffect(
    useCallback(() => {
      setDraft(getSetupDraft());
    }, []),
  );

  const isReady =
    draft.pairs.length === REQUIRED_WORD_PAIR_COUNT &&
    draft.pairs.every((pair) => pair.word && pair.translation);
  const updateFocusMode = (focusMode: FocusMode) => {
    updateSetupDraft({ focusMode });
    setDraft(getSetupDraft());
  };
  const updateMatchMode = (matchMode: MatchMode) => {
    updateSetupDraft({ matchMode });
    setDraft(getSetupDraft());
  };
  const startGame = () => {
    if (isReady) {
      setGameSession(draft);
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

function SettingsCard({
  title,
  detail,
  children,
}: {
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View>
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
        <ThemedText style={styles.cardDetail}>{detail}</ThemedText>
      </View>
      {children}
    </View>
  );
}

function ModeToggle<T extends FocusMode | MatchMode>({
  first,
  second,
  selected,
  onChange,
}: ModeToggleProps<T>) {
  return (
    <View style={styles.toggle}>
      <Pressable
        onPress={() => onChange(first)}
        style={[styles.toggleOption, selected === first && styles.toggleSelected]}
      >
        <ThemedText style={[styles.toggleText, selected === first && styles.toggleTextSelected]}>
          {first}
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => onChange(second)}
        style={[styles.toggleOption, selected === second && styles.toggleSelected]}
      >
        <ThemedText style={[styles.toggleText, selected === second && styles.toggleTextSelected]}>
          {second}
        </ThemedText>
      </Pressable>
    </View>
  );
}
