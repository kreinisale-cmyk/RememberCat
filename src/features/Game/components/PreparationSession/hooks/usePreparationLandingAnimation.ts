import { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

import { PreparationWordGridHandle } from '../components/PreparationWordGrid/types';
import {
  PREPARATION_CARD_ENTRANCE_DELAY_MS,
  PREPARATION_CARD_ENTRANCE_DURATION_MS,
  PREPARATION_FINAL_GRID_PAUSE_MS,
  PREPARATION_LANDING_DURATION_MS,
} from '../constants';
import { PreparationAnimationPhase, PreparationLandingLayouts } from '../types';
import { convertWindowLayoutToRoot, measureViewInWindow } from '../utils';

type UsePreparationLandingAnimationOptions = {
  cardRef: RefObject<View | null>;
  currentWordIndex: number;
  gridRef: RefObject<PreparationWordGridHandle | null>;
  isFinalWord: boolean;
  onAcknowledge: () => void;
  onWordLanded: () => void;
  rootRef: RefObject<View | null>;
  wordPairId: string;
};

type PreparationAnimationState = {
  phase: PreparationAnimationPhase;
  wordPairId: string;
};

type PreparationLandingLayoutState = {
  layouts: PreparationLandingLayouts;
  wordPairId: string;
};

export function usePreparationLandingAnimation({
  cardRef,
  currentWordIndex,
  gridRef,
  isFinalWord,
  onAcknowledge,
  onWordLanded,
  rootRef,
  wordPairId,
}: UsePreparationLandingAnimationOptions) {
  const flightProgress = useRef(new Animated.Value(0)).current;
  const sourceCardOpacity = useRef(new Animated.Value(0)).current;
  const [animationState, setAnimationState] = useState<PreparationAnimationState>({
    phase: PreparationAnimationPhase.Idle,
    wordPairId,
  });
  const [landingLayoutState, setLandingLayoutState] =
    useState<PreparationLandingLayoutState | null>(null);
  const [isSourceEntranceAnimating, setIsSourceEntranceAnimating] = useState(true);
  const activeAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const sourceEntranceAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layoutFrameRef = useRef<number | null>(null);
  const flightFrameRef = useRef<number | null>(null);
  const advanceFrameRef = useRef<number | null>(null);
  const generationRef = useRef(0);
  const isBusyRef = useRef(false);
  const phase =
    animationState.wordPairId === wordPairId
      ? animationState.phase
      : PreparationAnimationPhase.Idle;
  const landingLayouts =
    landingLayoutState?.wordPairId === wordPairId ? landingLayoutState.layouts : null;

  const clearScheduledWork = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }

    if (layoutFrameRef.current !== null) {
      cancelAnimationFrame(layoutFrameRef.current);
      layoutFrameRef.current = null;
    }

    if (flightFrameRef.current !== null) {
      cancelAnimationFrame(flightFrameRef.current);
      flightFrameRef.current = null;
    }

    if (advanceFrameRef.current !== null) {
      cancelAnimationFrame(advanceFrameRef.current);
      advanceFrameRef.current = null;
    }
  }, []);

  const cancelAnimation = useCallback(() => {
    generationRef.current += 1;
    activeAnimationRef.current?.stop();
    activeAnimationRef.current = null;
    sourceEntranceAnimationRef.current?.stop();
    sourceEntranceAnimationRef.current = null;
    clearScheduledWork();
    isBusyRef.current = false;
  }, [clearScheduledWork]);

  const finishLanding = useCallback(
    (generation: number) => {
      if (generation !== generationRef.current) {
        return;
      }

      activeAnimationRef.current = null;
      setAnimationState({ phase: PreparationAnimationPhase.Landed, wordPairId });
      onWordLanded();

      if (isFinalWord) {
        advanceTimeoutRef.current = setTimeout(() => {
          if (generation === generationRef.current) {
            onAcknowledge();
          }
        }, PREPARATION_FINAL_GRID_PAUSE_MS);

        return;
      }

      advanceFrameRef.current = requestAnimationFrame(() => {
        advanceFrameRef.current = null;

        if (generation === generationRef.current) {
          onAcknowledge();
        }
      });
    },
    [isFinalWord, onAcknowledge, onWordLanded, wordPairId],
  );

  const acknowledgeWord = useCallback(() => {
    if (isBusyRef.current || !landingLayouts || phase !== PreparationAnimationPhase.Idle) {
      return;
    }

    isBusyRef.current = true;
    const generation = generationRef.current;
    flightProgress.setValue(0);
    setAnimationState({ phase: PreparationAnimationPhase.Flying, wordPairId });

    flightFrameRef.current = requestAnimationFrame(() => {
      flightFrameRef.current = null;

      if (generation !== generationRef.current) {
        return;
      }

      activeAnimationRef.current = Animated.timing(flightProgress, {
        toValue: 1,
        duration: PREPARATION_LANDING_DURATION_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      });
      activeAnimationRef.current.start(({ finished }) => {
        if (finished) {
          finishLanding(generation);
        }
      });
    });
  }, [finishLanding, flightProgress, landingLayouts, phase, wordPairId]);

  useLayoutEffect(() => {
    cancelAnimation();
    const generation = generationRef.current;
    setLandingLayoutState(null);
    setAnimationState({ phase: PreparationAnimationPhase.Idle, wordPairId });
    setIsSourceEntranceAnimating(true);
    flightProgress.setValue(0);
    sourceCardOpacity.setValue(0);
    sourceEntranceAnimationRef.current = Animated.timing(sourceCardOpacity, {
      toValue: 1,
      delay: PREPARATION_CARD_ENTRANCE_DELAY_MS,
      duration: PREPARATION_CARD_ENTRANCE_DURATION_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
    sourceEntranceAnimationRef.current.start(({ finished }) => {
      sourceEntranceAnimationRef.current = null;

      if (finished && generation === generationRef.current) {
        setIsSourceEntranceAnimating(false);
      }
    });

    async function cacheLandingLayouts() {
      const [rootLayout, sourceLayout, destinationLayout] = await Promise.all([
        measureViewInWindow(rootRef.current),
        measureViewInWindow(cardRef.current),
        gridRef.current?.measureSlot(currentWordIndex) ?? Promise.resolve(null),
      ]);

      if (generation !== generationRef.current) {
        return;
      }

      if (!rootLayout || !sourceLayout || !destinationLayout) {
        layoutFrameRef.current = requestAnimationFrame(() => {
          layoutFrameRef.current = null;
          void cacheLandingLayouts();
        });
        return;
      }

      setLandingLayoutState({
        layouts: {
          source: convertWindowLayoutToRoot(sourceLayout, rootLayout),
          destination: convertWindowLayoutToRoot(destinationLayout, rootLayout),
        },
        wordPairId,
      });
    }

    layoutFrameRef.current = requestAnimationFrame(() => {
      layoutFrameRef.current = null;
      void cacheLandingLayouts();
    });

    return cancelAnimation;
  }, [
    cancelAnimation,
    cardRef,
    currentWordIndex,
    flightProgress,
    gridRef,
    rootRef,
    sourceCardOpacity,
    wordPairId,
  ]);

  return {
    acknowledgeWord,
    cancelAnimation,
    flightProgress,
    isSourceEntranceAnimating,
    landingLayouts,
    phase,
    sourceCardOpacity,
  };
}
