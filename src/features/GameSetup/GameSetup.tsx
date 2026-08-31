import { Href, router } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Cat from 'lucide-react-native/icons/cat';
import Clock from 'lucide-react-native/icons/clock';
import Layers from 'lucide-react-native/icons/layers';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';
import { BuildYourDeckEntryMode, BuildYourDeckEntryOrigin } from '@/features/BuildYourDeck/types';
import { DeckSize, FocusMode, MatchMode } from '@/features/GameSession/types';
import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { DeckSizeSelector } from './components/DeckSizeSelector/DeckSizeSelector';
import { ModeToggle } from './components/ModeToggle/ModeToggle';
import { SettingsCard } from './components/SettingsCard/SettingsCard';
import { SettingsCardIconTone } from './components/SettingsCard/types';
import { WordListSetupActions } from './components/WordListSetupActions/WordListSetupActions';
import { GAME_SETUP_ROUTE, WORD_EDITOR_ROUTE, WORDS_ROUTE } from './constants';
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
    updateDraft({ deckSize, pairs: [], savedDeckId: null });
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
      params: { size: String(draft.deckSize), selectedDeckId: latestSavedDeck?.id },
    } as unknown as Href);
  }

  function openNewWordList() {
    updateDraft({ pairs: [], savedDeckId: null });
    router.push({
      pathname: WORD_EDITOR_ROUTE,
      params: {
        mode: BuildYourDeckEntryMode.Create,
        origin: BuildYourDeckEntryOrigin.GameSetup,
        size: String(draft.deckSize),
      },
    } as unknown as Href);
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              accessibilityLabel="Go back"
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => router.back()}
              style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
            >
              <ArrowLeft color={RememberCatColors.foreground} size={20} strokeWidth={2.4} />
            </Pressable>
            <View style={styles.brandBadge}>
              <Cat color={RememberCatColors.primary} size={22} strokeWidth={2.2} />
            </View>
          </View>
          <ThemedText style={styles.kicker}>GAME SETUP</ThemedText>
          <ThemedText style={styles.title}>Your practice round</ThemedText>
          <ThemedText style={styles.intro}>
            Choose how you’d like to play, then add the words you want to remember.
          </ThemedText>
        </View>
        <View style={styles.cards}>
          <SettingsCard
            badge={`${draft.deckSize} words`}
            title="Practice size"
            detail={`${draft.deckSize} words in this practice deck`}
          >
            <DeckSizeSelector selectedDeckSize={draft.deckSize} onChange={updateDeckSize} />
          </SettingsCard>
          <SettingsCard
            icon={Clock}
            iconTone={SettingsCardIconTone.Secondary}
            title="Focus mode"
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
            icon={Layers}
            iconTone={SettingsCardIconTone.Accent}
            title="Match mode"
            detail={getMatchModeDescription(draft.matchMode)}
          >
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
