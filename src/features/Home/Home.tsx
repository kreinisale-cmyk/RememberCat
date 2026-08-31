import { router } from 'expo-router';
import Cat from 'lucide-react-native/icons/cat';
import Heart from 'lucide-react-native/icons/heart';
import Sparkles from 'lucide-react-native/icons/sparkles';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { GAME_SETUP_ROUTE, HOME_COPY } from './constants';
import { styles } from './styles';

export function Home() {
  function openGameSetup() {
    router.push(GAME_SETUP_ROUTE);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View pointerEvents="none" style={styles.coralOrb} />
      <View pointerEvents="none" style={styles.goldOrb} />
      <Heart
        color={RememberCatColors.accent}
        fill={RememberCatColors.accent}
        pointerEvents="none"
        size={18}
        style={styles.heartDecoration}
      />
      <Sparkles
        color={RememberCatColors.secondaryForeground}
        pointerEvents="none"
        size={22}
        style={styles.sparkleDecoration}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.brandSection}>
            <View style={styles.catBadge}>
              <Cat color={RememberCatColors.primary} size={42} strokeWidth={2.1} />
            </View>
            <View style={styles.brandRow}>
              <ThemedText style={styles.brandName}>{HOME_COPY.brandName}</ThemedText>
              <View style={styles.brandDot} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(110).duration(450)} style={styles.heroSection}>
            <View style={styles.kickerPill}>
              <ThemedText style={styles.kicker}>{HOME_COPY.kicker}</ThemedText>
            </View>
            <ThemedText style={styles.title}>{HOME_COPY.title}</ThemedText>
            <ThemedText style={styles.subtitle}>{HOME_COPY.subtitle}</ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(210).duration(450)} style={styles.actionSection}>
            <Pressable
              accessibilityHint={HOME_COPY.buttonHint}
              accessibilityRole="button"
              onPress={openGameSetup}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <ThemedText style={styles.buttonText}>{HOME_COPY.button}</ThemedText>
              <ThemedText style={styles.buttonArrow}>→</ThemedText>
            </Pressable>
            <ThemedText style={styles.footer}>{HOME_COPY.footer}</ThemedText>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
