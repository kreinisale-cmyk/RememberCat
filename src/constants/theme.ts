/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const MaxContentWidth = 800;

export const RememberCatColors = {
  background: '#faf3e3',
  foreground: '#4a233e',
  card: '#fffdf8',
  primary: '#e94646',
  primaryForeground: '#fffbf3',
  secondary: '#fbc77c',
  secondaryForeground: '#663305',
  muted: '#f6e9d5',
  mutedForeground: '#805d6d',
  accent: '#e17cc2',
  accentForeground: '#fffafd',
  border: '#e4d1bc',
  selectedBackground: '#fde7e3',
  primaryBorder: 'rgba(233, 70, 70, 0.4)',
  primaryMuted: 'rgba(233, 70, 70, 0.6)',
  destructive: '#dc3f4b',
  destructiveBackground: 'rgba(220, 63, 75, 0.1)',
  success: '#3f8f79',
  successForeground: '#fffdf8',
  successBackground: '#e7f6f2',
  inputBackground: '#fffdfa',
  scrim: 'rgba(74, 35, 62, 0.38)',
  shadow: '#4a233e',
} as const;

export const RememberCatFonts = {
  displaySemiBold: 'Fredoka_600SemiBold',
  body: 'Nunito_400Regular',
  bodyBold: 'Nunito_700Bold',
  bodyExtraBold: 'Nunito_800ExtraBold',
} as const;
