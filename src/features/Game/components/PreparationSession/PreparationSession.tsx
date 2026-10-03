import X from 'lucide-react-native/icons/x';
import { useRef } from 'react';
import { Alert, Animated, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { FlyingPreparationCard } from './components/FlyingPreparationCard/FlyingPreparationCard';
import { PreparationWordCard } from './components/PreparationWordCard/PreparationWordCard';
import { PreparationWordGrid } from './components/PreparationWordGrid/PreparationWordGrid';
import { PreparationWordGridHandle } from './components/PreparationWordGrid/types';
import {
  CONFIRM_SKIP_TRAINING_LABEL,
  KEEP_TRAINING_LABEL,
  PREPARATION_CLOSE_ACCESSIBILITY_LABEL,
  PREPARATION_HINT,
  PREPARATION_KICKER,
  PREPARATION_TITLE,
  SKIP_TRAINING_CONFIRM_MESSAGE,
  SKIP_TRAINING_CONFIRM_TITLE,
  SKIP_TRAINING_LABEL,
} from './constants';
import { usePreparationLandingAnimation } from './hooks/usePreparationLandingAnimation';
import { styles } from './styles';
import { PreparationAnimationPhase, PreparationSessionProps } from './types';
import {
  createPreparationProgressLabel,
  getPreparedWordCount,
  isFinalPreparationWord,
} from './utils';

export function PreparationSession({
  wordPair,
  wordPairs,
  currentWordNumber,
  totalWordCount,
  onAcknowledge,
  onClose,
  onSkip,
  onWordLanded,
}: PreparationSessionProps) {
  const rootRef = useRef<View>(null);
  const cardRef = useRef<View>(null);
  const gridRef = useRef<PreparationWordGridHandle>(null);
  const flyingWordPairRef = useRef(wordPair);
  const currentWordIndex = currentWordNumber - 1;
  const progress = currentWordNumber / totalWordCount;
  const isFinalWord = isFinalPreparationWord(currentWordNumber, totalWordCount);
  const preparationAnimation = usePreparationLandingAnimation({
    cardRef,
    currentWordIndex,
    gridRef,
    isFinalWord,
    onAcknowledge,
    onWordLanded,
    rootRef,
    wordPairId: wordPair.id,
  });
  const isCurrentWordLanded = preparationAnimation.phase === PreparationAnimationPhase.Landed;
  const isFlying = preparationAnimation.phase === PreparationAnimationPhase.Flying;
  const isInteractionDisabled =
    preparationAnimation.phase !== PreparationAnimationPhase.Idle ||
    !preparationAnimation.landingLayouts;
  const isOverlayVisible = preparationAnimation.phase !== PreparationAnimationPhase.Landed;
  const isSourceVisible = preparationAnimation.phase === PreparationAnimationPhase.Idle;
  const preparedWordCount = getPreparedWordCount(currentWordNumber, isCurrentWordLanded);

  function closePreparation() {
    preparationAnimation.cancelAnimation();
    onClose();
  }

  function acknowledgeWord() {
    flyingWordPairRef.current = wordPair;
    preparationAnimation.acknowledgeWord();
  }

  function skipTraining() {
    preparationAnimation.cancelAnimation();
    onSkip();
  }

  function confirmSkipTraining() {
    Alert.alert(SKIP_TRAINING_CONFIRM_TITLE, SKIP_TRAINING_CONFIRM_MESSAGE, [
      { text: KEEP_TRAINING_LABEL, style: 'cancel' },
      { text: CONFIRM_SKIP_TRAINING_LABEL, onPress: skipTraining },
    ]);
  }

  return (
    <View ref={rootRef} style={styles.content}>
      <View style={styles.top}>
        <Pressable
          accessibilityLabel={PREPARATION_CLOSE_ACCESSIBILITY_LABEL}
          accessibilityRole="button"
          onPress={closePreparation}
          style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
        >
          <X color={RememberCatColors.mutedForeground} size={20} strokeWidth={2.4} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <ThemedText style={styles.progressLabel}>
          {createPreparationProgressLabel(currentWordNumber, totalWordCount)}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={confirmSkipTraining}
          style={({ pressed }) => [styles.skipButton, pressed && styles.skipButtonPressed]}
        >
          <ThemedText style={styles.skipButtonText}>{SKIP_TRAINING_LABEL}</ThemedText>
        </Pressable>
      </View>

      <View accessibilityRole="header" style={styles.heading}>
        <ThemedText style={styles.kicker}>{PREPARATION_KICKER}</ThemedText>
        <ThemedText style={styles.title}>{PREPARATION_TITLE}</ThemedText>
        <ThemedText style={styles.hint}>{PREPARATION_HINT}</ThemedText>
      </View>

      <View style={styles.gridArea}>
        <PreparationWordGrid
          ref={gridRef}
          activeIndex={currentWordIndex}
          preparedWordCount={preparedWordCount}
          wordPairs={wordPairs}
        />
      </View>

      {isOverlayVisible ? (
        <View style={styles.overlay}>
          {isSourceVisible ? (
            <Animated.View
              needsOffscreenAlphaCompositing={preparationAnimation.isSourceEntranceAnimating}
              renderToHardwareTextureAndroid={preparationAnimation.isSourceEntranceAnimating}
              style={[
                styles.sourceCardWrapper,
                { opacity: preparationAnimation.sourceCardOpacity },
              ]}
            >
              <PreparationWordCard
                ref={cardRef}
                isDisabled={isInteractionDisabled}
                isFinalWord={isFinalWord}
                onAcknowledge={acknowledgeWord}
                wordPair={wordPair}
              />
            </Animated.View>
          ) : null}
        </View>
      ) : null}

      {isFlying && preparationAnimation.landingLayouts ? (
        <View pointerEvents="none" style={styles.flyingLayer}>
          <FlyingPreparationCard
            layouts={preparationAnimation.landingLayouts}
            progress={preparationAnimation.flightProgress}
            wordPair={flyingWordPairRef.current}
          />
        </View>
      ) : null}
    </View>
  );
}
