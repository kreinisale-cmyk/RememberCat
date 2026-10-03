import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { MATCH_FEEDBACK_DURATION_MS } from '../../constants';
import { MatchCelebrationAnimation, MatchFeedback } from '../../types';
import {
  ALTERNATE_CELEBRATION_DURATION_MS,
  CARD_ENTER_SCALE,
  CARD_SELECTED_SCALE,
  COMPLETED_CARD_DIP_SCALE,
  COMPLETED_CARD_OPACITY,
  COMPLETED_CARD_SETTLE_DURATION_MS,
  COMPLETED_CHECK_END_ROTATION,
  COMPLETED_CHECK_START_ROTATION,
  COUNTDOWN_BADGE_END_ROTATION,
  COUNTDOWN_BADGE_ENTER_DURATION_MS,
  COUNTDOWN_BADGE_EXIT_DURATION_MS,
  COUNTDOWN_BADGE_EXIT_SCALE,
  COUNTDOWN_BADGE_HOLD_DURATION_MS,
  COUNTDOWN_BADGE_POP_SCALE,
  COUNTDOWN_BADGE_START_ROTATION,
  COUNTDOWN_BADGE_START_SCALE,
  CORRECT_CARD_BURST_DURATION_MS,
  CORRECT_CARD_BURST_SCALE,
  CORRECT_CARD_HOLD_DURATION_MS,
  CORRECT_CARD_RING_SCALE,
  FINAL_MATCH_DIP_DURATION_MS,
  FINAL_MATCH_DIP_SCALE,
  FINAL_MATCH_POP_DURATION_MS,
  FINAL_MATCH_POP_SCALE,
  FINAL_MATCH_SETTLE_DURATION_MS,
  INCORRECT_CARD_SHAKE_DISTANCE,
  INCORRECT_CARD_SHAKE_DURATION_MS,
  PORTAL_RING_END_ROTATION_DEGREES,
  PORTAL_RING_INNER_END_SCALE,
  PORTAL_RING_OUTER_END_SCALE,
  PORTAL_SPARK_LABEL,
  SHATTER_FRAGMENT_END_ROTATION_DEGREES,
  SHATTER_FRAGMENT_END_SCALE,
  SHATTER_FRAGMENT_HORIZONTAL_DISTANCE,
  SHATTER_FRAGMENT_VERTICAL_DISTANCE,
  SHATTER_LABEL,
} from './constants';
import { styles } from './styles';
import { MatchCardProps } from './types';
import {
  createMatchCardCelebrationMotionOutputRanges,
  createMatchOptionAccessibilityLabel,
  getMatchCardMotionDirection,
} from './utils';

export function MatchCard({
  label,
  side,
  completed,
  celebrationAnimation,
  completionCountdown,
  selected,
  feedback,
  disabled,
  onPress,
}: MatchCardProps) {
  const entranceAnimation = useRef(new Animated.Value(0)).current;
  const selectionAnimation = useRef(new Animated.Value(1)).current;
  const feedbackAnimation = useRef(new Animated.Value(1)).current;
  const burstAnimation = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const countdownAnimation = useRef(new Animated.Value(0)).current;
  const completionAnimation = useRef(new Animated.Value(0)).current;
  const alternateCelebrationAnimation = useRef(new Animated.Value(0)).current;
  const motionDirection = getMatchCardMotionDirection(side);
  const isCorrectFeedback = feedback === MatchFeedback.Correct;
  const isFinalCountdownCelebration = isCorrectFeedback && completionCountdown !== null;
  const isShatterCelebration =
    isCorrectFeedback &&
    completionCountdown === null &&
    celebrationAnimation === MatchCelebrationAnimation.Shatter;
  const isPortalCelebration =
    isCorrectFeedback &&
    completionCountdown === null &&
    celebrationAnimation === MatchCelebrationAnimation.Portal;
  const isBurstCelebration =
    isCorrectFeedback &&
    completionCountdown === null &&
    (celebrationAnimation === null || celebrationAnimation === MatchCelebrationAnimation.Burst);
  const isAlternateCelebration = isShatterCelebration || isPortalCelebration;

  useEffect(() => {
    Animated.spring(entranceAnimation, {
      toValue: 1,
      damping: 9,
      stiffness: 130,
      useNativeDriver: true,
    }).start();
  }, [entranceAnimation]);

  useEffect(() => {
    completionAnimation.stopAnimation();

    if (completed) {
      completionAnimation.setValue(0);
      Animated.timing(completionAnimation, {
        toValue: 1,
        duration: COMPLETED_CARD_SETTLE_DURATION_MS,
        useNativeDriver: true,
      }).start();
    } else {
      completionAnimation.setValue(0);
    }
  }, [completed, completionAnimation]);

  useEffect(() => {
    if (feedback === MatchFeedback.Correct) {
      selectionAnimation.stopAnimation();
      selectionAnimation.setValue(1);
      feedbackAnimation.setValue(1);
      burstAnimation.setValue(0);
      countdownAnimation.setValue(0);
      alternateCelebrationAnimation.stopAnimation();
      alternateCelebrationAnimation.setValue(0);

      if (isFinalCountdownCelebration) {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(feedbackAnimation, {
              toValue: FINAL_MATCH_POP_SCALE,
              duration: FINAL_MATCH_POP_DURATION_MS,
              useNativeDriver: true,
            }),
            Animated.timing(feedbackAnimation, {
              toValue: FINAL_MATCH_DIP_SCALE,
              duration: FINAL_MATCH_DIP_DURATION_MS,
              useNativeDriver: true,
            }),
            Animated.timing(feedbackAnimation, {
              toValue: 1,
              duration: FINAL_MATCH_SETTLE_DURATION_MS,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(countdownAnimation, {
              toValue: 0.35,
              duration: COUNTDOWN_BADGE_ENTER_DURATION_MS,
              useNativeDriver: true,
            }),
            Animated.delay(COUNTDOWN_BADGE_HOLD_DURATION_MS),
            Animated.timing(countdownAnimation, {
              toValue: 1,
              duration: COUNTDOWN_BADGE_EXIT_DURATION_MS,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(burstAnimation, {
            toValue: 1,
            duration: MATCH_FEEDBACK_DURATION_MS,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (isAlternateCelebration) {
        Animated.timing(alternateCelebrationAnimation, {
          toValue: 1,
          duration: ALTERNATE_CELEBRATION_DURATION_MS,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(feedbackAnimation, {
              toValue: CORRECT_CARD_BURST_SCALE,
              duration: CORRECT_CARD_BURST_DURATION_MS,
              useNativeDriver: true,
            }),
            Animated.delay(CORRECT_CARD_HOLD_DURATION_MS - CORRECT_CARD_BURST_DURATION_MS),
            Animated.timing(feedbackAnimation, {
              toValue: 0,
              duration: MATCH_FEEDBACK_DURATION_MS - CORRECT_CARD_HOLD_DURATION_MS,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(burstAnimation, {
            toValue: 1,
            duration: MATCH_FEEDBACK_DURATION_MS,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else if (feedback === MatchFeedback.Incorrect) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: -INCORRECT_CARD_SHAKE_DISTANCE,
          duration: INCORRECT_CARD_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: INCORRECT_CARD_SHAKE_DISTANCE,
          duration: INCORRECT_CARD_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: INCORRECT_CARD_SHAKE_DURATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(selectionAnimation, {
        toValue: selected ? CARD_SELECTED_SCALE : 1,
        damping: 9,
        stiffness: 170,
        useNativeDriver: true,
      }).start();
      feedbackAnimation.setValue(1);
      burstAnimation.setValue(0);
      shakeAnimation.setValue(0);
      countdownAnimation.setValue(0);
      alternateCelebrationAnimation.stopAnimation();
      alternateCelebrationAnimation.setValue(0);
    }
  }, [
    alternateCelebrationAnimation,
    burstAnimation,
    countdownAnimation,
    feedback,
    feedbackAnimation,
    isAlternateCelebration,
    isFinalCountdownCelebration,
    selected,
    selectionAnimation,
    shakeAnimation,
  ]);

  const entranceScale = entranceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_ENTER_SCALE, 1],
  });
  const burstScale = burstAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, CORRECT_CARD_RING_SCALE],
  });
  const burstOpacity = burstAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 0],
  });
  const burstRotation = burstAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '35deg'],
  });
  const countdownOpacity = countdownAnimation.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, 1, 0],
  });
  const countdownScale = countdownAnimation.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [
      COUNTDOWN_BADGE_START_SCALE,
      COUNTDOWN_BADGE_POP_SCALE,
      COUNTDOWN_BADGE_EXIT_SCALE,
    ],
  });
  const countdownRotation = countdownAnimation.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [COUNTDOWN_BADGE_START_ROTATION, '0deg', COUNTDOWN_BADGE_END_ROTATION],
  });
  const completedOpacity = completionAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, COMPLETED_CARD_OPACITY],
  });
  const completedScale = completionAnimation.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, COMPLETED_CARD_DIP_SCALE, 1],
  });
  const completedCheckScale = completionAnimation.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [0.2, 1.22, 1],
  });
  const completedCheckRotation = completionAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [COMPLETED_CHECK_START_ROTATION, COMPLETED_CHECK_END_ROTATION],
  });
  const completedTransitionGlowOpacity = completionAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const celebrationMotionOutputRanges = createMatchCardCelebrationMotionOutputRanges(
    celebrationAnimation,
    motionDirection,
  );
  const alternateCelebrationOpacity = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.45, 0.72, 1],
    outputRange: celebrationMotionOutputRanges.opacity,
  });
  const alternateCelebrationScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.45, 0.72, 1],
    outputRange: celebrationMotionOutputRanges.scale,
  });
  const alternateCelebrationTranslateX = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.45, 0.72, 1],
    outputRange: celebrationMotionOutputRanges.translateX,
  });
  const alternateCelebrationTranslateY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.45, 0.72, 1],
    outputRange: celebrationMotionOutputRanges.translateY,
  });
  const alternateCelebrationRotation = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.45, 0.72, 1],
    outputRange: celebrationMotionOutputRanges.rotation,
  });
  const portalCardRotationY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.45, 0.72, 1],
    outputRange: celebrationMotionOutputRanges.rotationY,
  });
  const alternateEffectOpacity = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.12, 0.32, 0.78, 1],
    outputRange: [0, 0.45, 1, 1, 0],
  });
  const shatterFragmentScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.38, 1],
    outputRange: [0.2, 0.35, 1, SHATTER_FRAGMENT_END_SCALE],
  });
  const shatterFragmentOneTranslateX = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, -7, -SHATTER_FRAGMENT_HORIZONTAL_DISTANCE],
  });
  const shatterFragmentTwoTranslateX = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, -4, -SHATTER_FRAGMENT_HORIZONTAL_DISTANCE * 0.76],
  });
  const shatterFragmentThreeTranslateX = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 7, SHATTER_FRAGMENT_HORIZONTAL_DISTANCE],
  });
  const shatterFragmentFourTranslateX = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 4, SHATTER_FRAGMENT_HORIZONTAL_DISTANCE * 0.8],
  });
  const shatterFragmentOneTranslateY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, -5, -SHATTER_FRAGMENT_VERTICAL_DISTANCE],
  });
  const shatterFragmentTwoTranslateY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 5, SHATTER_FRAGMENT_VERTICAL_DISTANCE * 0.9],
  });
  const shatterFragmentThreeTranslateY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, -4, -SHATTER_FRAGMENT_VERTICAL_DISTANCE * 0.92],
  });
  const shatterFragmentFourTranslateY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 5, SHATTER_FRAGMENT_VERTICAL_DISTANCE],
  });
  const shatterFragmentClockwiseRotation = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${SHATTER_FRAGMENT_END_ROTATION_DEGREES}deg`],
  });
  const shatterFragmentCounterRotation = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${-SHATTER_FRAGMENT_END_ROTATION_DEGREES}deg`],
  });
  const shatterLabelScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.16, 0.34, 0.7, 1],
    outputRange: [0.2, 0.3, 1.3, 1, 0.65],
  });
  const shatterLabelTranslateY = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.34, 1],
    outputRange: [5, -10, -28],
  });
  const portalOuterRingScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.16, 0.42, 0.76, 1],
    outputRange: [0.2, 0.55, 1.1, PORTAL_RING_OUTER_END_SCALE, 0.18],
  });
  const portalInnerRingScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.16, 0.42, 0.76, 1],
    outputRange: [0.1, 0.4, 1, 0.68, PORTAL_RING_INNER_END_SCALE],
  });
  const portalRingRotation = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${motionDirection * PORTAL_RING_END_ROTATION_DEGREES}deg`],
  });
  const portalCoreScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.18, 0.55, 0.82, 1],
    outputRange: [0, 0.35, 1, 1.18, 0],
  });
  const portalSparkScale = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 0.22, 0.52, 1],
    outputRange: [0.2, 0.3, 1.25, 0.4],
  });
  const portalSparkRotation = alternateCelebrationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${motionDirection * -180}deg`],
  });

  let feedbackStyle;

  if (isShatterCelebration) {
    feedbackStyle = styles.shatterCorrect;
  } else if (isPortalCelebration) {
    feedbackStyle = styles.portalCorrect;
  } else if (feedback === MatchFeedback.Correct) {
    feedbackStyle = styles.correct;
  } else if (feedback === MatchFeedback.Incorrect) {
    feedbackStyle = styles.incorrect;
  }

  let cardOpacity: Animated.Value | Animated.AnimatedInterpolation<number> = entranceAnimation;

  if (completed) {
    cardOpacity = completedOpacity;
  } else if (isAlternateCelebration) {
    cardOpacity = alternateCelebrationOpacity;
  }

  return (
    <Animated.View
      style={[
        styles.wrapper,
        feedback !== MatchFeedback.None && styles.feedbackWrapper,
        {
          opacity: cardOpacity,
          transform: [
            { perspective: 900 },
            { scale: entranceScale },
            { scale: selectionAnimation },
            { scale: feedbackAnimation },
            { scale: completedScale },
            { scale: alternateCelebrationScale },
            { translateX: shakeAnimation },
            { translateX: alternateCelebrationTranslateX },
            { translateY: alternateCelebrationTranslateY },
            { rotate: alternateCelebrationRotation },
            { rotateY: portalCardRotationY },
          ],
        },
      ]}
    >
      {isFinalCountdownCelebration || isBurstCelebration ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.burstRing,
            {
              opacity: burstOpacity,
              transform: [{ scale: burstScale }, { rotate: burstRotation }],
            },
          ]}
        >
          <ThemedText style={styles.burstSpark}>✦</ThemedText>
        </Animated.View>
      ) : null}
      {feedback === MatchFeedback.Correct && completionCountdown !== null ? (
        <Animated.View
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[
            styles.countdownBadge,
            {
              opacity: countdownOpacity,
              transform: [{ scale: countdownScale }, { rotate: countdownRotation }],
            },
          ]}
        >
          <ThemedText style={styles.countdownSparkLeft}>✦</ThemedText>
          <ThemedText style={styles.countdownNumber}>{completionCountdown}</ThemedText>
          <ThemedText style={styles.countdownSparkRight}>✧</ThemedText>
        </Animated.View>
      ) : null}
      {isShatterCelebration ? (
        <Animated.View
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.celebrationLayer, { opacity: alternateEffectOpacity }]}
        >
          <Animated.View
            style={[
              styles.shatterFragment,
              styles.shatterFragmentOne,
              {
                transform: [
                  { translateX: shatterFragmentOneTranslateX },
                  { translateY: shatterFragmentOneTranslateY },
                  { rotate: shatterFragmentCounterRotation },
                  { scale: shatterFragmentScale },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.shatterFragment,
              styles.shatterFragmentGold,
              styles.shatterFragmentTwo,
              {
                transform: [
                  { translateX: shatterFragmentTwoTranslateX },
                  { translateY: shatterFragmentTwoTranslateY },
                  { rotate: shatterFragmentClockwiseRotation },
                  { scale: shatterFragmentScale },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.shatterFragment,
              styles.shatterFragmentPink,
              styles.shatterFragmentThree,
              {
                transform: [
                  { translateX: shatterFragmentThreeTranslateX },
                  { translateY: shatterFragmentThreeTranslateY },
                  { rotate: shatterFragmentClockwiseRotation },
                  { scale: shatterFragmentScale },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.shatterFragment,
              styles.shatterFragmentFour,
              {
                transform: [
                  { translateX: shatterFragmentFourTranslateX },
                  { translateY: shatterFragmentFourTranslateY },
                  { rotate: shatterFragmentCounterRotation },
                  { scale: shatterFragmentScale },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.shatterLabelContainer,
              {
                transform: [{ translateY: shatterLabelTranslateY }, { scale: shatterLabelScale }],
              },
            ]}
          >
            <ThemedText style={styles.shatterLabel}>{SHATTER_LABEL}</ThemedText>
          </Animated.View>
        </Animated.View>
      ) : null}
      {isPortalCelebration ? (
        <Animated.View
          pointerEvents="none"
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.celebrationLayer, { opacity: alternateEffectOpacity }]}
        >
          <Animated.View
            style={[
              styles.portalOuterRing,
              {
                transform: [{ scale: portalOuterRingScale }, { rotate: portalRingRotation }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.portalInnerRing,
              {
                transform: [{ scale: portalInnerRingScale }, { rotate: portalRingRotation }],
              },
            ]}
          />
          <Animated.View style={[styles.portalCore, { transform: [{ scale: portalCoreScale }] }]} />
          <Animated.View
            style={[
              styles.portalSparkContainer,
              styles.portalSparkLeft,
              {
                transform: [{ scale: portalSparkScale }, { rotate: portalSparkRotation }],
              },
            ]}
          >
            <ThemedText style={styles.portalSpark}>{PORTAL_SPARK_LABEL}</ThemedText>
          </Animated.View>
          <Animated.View
            style={[
              styles.portalSparkContainer,
              styles.portalSparkRight,
              {
                transform: [{ scale: portalSparkScale }, { rotate: portalSparkRotation }],
              },
            ]}
          >
            <ThemedText style={styles.portalSpark}>{PORTAL_SPARK_LABEL}</ThemedText>
          </Animated.View>
        </Animated.View>
      ) : null}
      <Pressable
        android_disableSound
        accessibilityRole="button"
        accessibilityLabel={createMatchOptionAccessibilityLabel(label, completed)}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.card,
          selected && styles.selected,
          completed && styles.completed,
          feedbackStyle,
        ]}
      >
        {completed ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.completedTransitionGlow, { opacity: completedTransitionGlowOpacity }]}
          />
        ) : null}
        <ThemedText
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.text, completed && styles.completedText]}
        >
          {label}
        </ThemedText>
        {completed ? (
          <Animated.View
            style={[
              styles.completedMarkBadge,
              {
                opacity: completionAnimation,
                transform: [{ scale: completedCheckScale }, { rotate: completedCheckRotation }],
              },
            ]}
          >
            <ThemedText style={styles.completedMark}>✓</ThemedText>
          </Animated.View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}
