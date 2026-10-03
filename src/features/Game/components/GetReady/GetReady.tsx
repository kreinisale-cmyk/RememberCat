import Cat from 'lucide-react-native/icons/cat';
import Sparkles from 'lucide-react-native/icons/sparkles';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import {
  GET_READY_ACCESSIBILITY_LABEL,
  GET_READY_CAT_ICON_SIZE,
  GET_READY_KICKER,
  GET_READY_SPARKLE_ICON_SIZE,
  GET_READY_TITLE,
} from './constants';
import { useGetReadyIntro } from './hooks/useGetReadyIntro';
import { styles } from './styles';
import { GetReadyProps } from './types';

export function GetReady({ onComplete }: GetReadyProps) {
  const animatedStyles = useGetReadyIntro(onComplete);

  return (
    <SafeAreaView style={styles.screen}>
      <Animated.View
        accessible
        accessibilityLabel={GET_READY_ACCESSIBILITY_LABEL}
        style={[styles.content, animatedStyles.screen]}
      >
        <Animated.View pointerEvents="none" style={[styles.sparkleLeft, animatedStyles.sparkle]}>
          <Sparkles color={RememberCatColors.accent} size={GET_READY_SPARKLE_ICON_SIZE} />
        </Animated.View>
        <Animated.View pointerEvents="none" style={[styles.sparkleRight, animatedStyles.sparkle]}>
          <Sparkles
            color={RememberCatColors.secondaryForeground}
            size={GET_READY_SPARKLE_ICON_SIZE}
          />
        </Animated.View>
        <Animated.View style={[styles.catBadge, animatedStyles.cat]}>
          <Cat color={RememberCatColors.primary} size={GET_READY_CAT_ICON_SIZE} strokeWidth={2.2} />
        </Animated.View>
        <Animated.View style={[styles.copy, animatedStyles.title]}>
          <ThemedText style={styles.kicker}>{GET_READY_KICKER}</ThemedText>
          <ThemedText style={styles.title}>{GET_READY_TITLE}</ThemedText>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
