import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import { CatMark } from './components/CatMark/CatMark';
import { FloatingHeart } from './components/FloatingHeart/FloatingHeart';
import { GAME_SETUP_ROUTE, HOME_COPY } from './constants';
import { styles } from './styles';

export function Home() {
  return (
    <View style={styles.screen}>
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />
      <FloatingHeart delayMs={0} size={18} style={styles.heartLeft} />
      <FloatingHeart delayMs={500} size={13} style={styles.heartRight} />
      <SafeAreaView style={styles.safeArea}>
        <Animated.Text entering={FadeInDown.duration(400)} style={styles.eyebrow}>
          {HOME_COPY.eyebrow}
        </Animated.Text>
        <View style={styles.hero}>
          <Animated.View entering={FadeInDown.springify()}>
            <CatMark />
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(120).springify()}>
            <ThemedText style={styles.title}>Remember</ThemedText>
            <ThemedText style={[styles.title, styles.titleAccent]}>Cat.</ThemedText>
          </Animated.View>
          <Animated.View entering={FadeInUp.delay(220).springify()}>
            <ThemedText style={styles.subtitle}>{HOME_COPY.subtitle}</ThemedText>
          </Animated.View>
        </View>
        <Animated.View entering={FadeInUp.delay(320).springify()}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(GAME_SETUP_ROUTE)}
            style={styles.button}
          >
            <ThemedText style={styles.buttonText}>{HOME_COPY.button}</ThemedText>
          </Pressable>
          <ThemedText style={styles.footer}>Made for the cats you never want to forget.</ThemedText>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
