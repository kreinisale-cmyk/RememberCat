import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BuildYourDeckEntryMode } from '@/features/BuildYourDeck/types';
import { DeckSize, FocusMode, MatchMode } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { DeckSizeSelector } from './components/DeckSizeSelector/DeckSizeSelector';
import { ModeToggle } from './components/ModeToggle/ModeToggle';
import { SettingsCard } from './components/SettingsCard/SettingsCard';
import { WordListSetupActions } from './components/WordListSetupActions/WordListSetupActions';
import { GAME_SETUP_ROUTE, WORDS_ROUTE } from './constants';
import { styles } from './styles';
import {
  findLatestSavedDeckForSize,
  getFocusModeDescription,
  getMatchModeDescription,
} from './utils';

export function GameSetup() {
  const {
    draft,
    savedDecks,
    isSavedDeckLibraryLoading,
    savedDeckLibraryError,
    startSavedDeckGame,
    updateDraft,
  } = useGameSession();
  const latestSavedDeck = findLatestSavedDeckForSize(savedDecks, draft.deckSize);

  function updateDeckSize(deckSize: DeckSize) {
    updateDraft({ deckSize, pairs: [] });
  }

  function updateFocusMode(focusMode: FocusMode) {
    updateDraft({ focusMode });
  }

  function updateMatchMode(matchMode: MatchMode) {
    updateDraft({ matchMode });
  }

  function continuePractice() {
    if (!latestSavedDeck || !startSavedDeckGame(latestSavedDeck.id)) {
      return;
    }

    router.push(GAME_SETUP_ROUTE);
  }

  function openSavedWordLists() {
    router.push({
      pathname: WORDS_ROUTE,
      params: { mode: BuildYourDeckEntryMode.Library },
    });
  }

  function openNewWordList() {
    updateDraft({ pairs: [] });
    router.push({
      pathname: WORDS_ROUTE,
      params: { mode: BuildYourDeckEntryMode.Create },
    });
  }

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
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.intro}>
          Choose how you’d like to play, then add the words you want to remember.
        </ThemedText>
        <View style={styles.cards}>
          <SettingsCard
            title="Practice size"
            detail={`${draft.deckSize} words in this practice deck`}
          >
            <DeckSizeSelector selectedDeckSize={draft.deckSize} onChange={updateDeckSize} />
          </SettingsCard>
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
          <WordListSetupActions
            deckSize={draft.deckSize}
            latestSavedDeck={latestSavedDeck}
            isLoading={isSavedDeckLibraryLoading}
            errorMessage={savedDeckLibraryError}
            onAdd={openNewWordList}
            onContinue={continuePractice}
            onEdit={openSavedWordLists}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
