import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: RememberCatColors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  header: { paddingBottom: 8 },
  brandBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 22,
    backgroundColor: RememberCatColors.selectedBackground,
  },
  kicker: {
    marginTop: 24,
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2.16,
  },
  title: {
    marginTop: 6,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 32,
    lineHeight: 38,
  },
  intro: {
    marginTop: 8,
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 15,
    lineHeight: 24,
  },
  cards: { gap: 16, marginTop: 20 },
});
