import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: RememberCatColors.background,
    paddingHorizontal: 20,
  },
  content: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12 },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: RememberCatColors.border,
    backgroundColor: RememberCatColors.card,
    shadowColor: RememberCatColors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  pressed: { transform: [{ scale: 0.95 }] },
  kicker: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    letterSpacing: 1.8,
    fontSize: 10,
    lineHeight: 14,
  },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 27,
    lineHeight: 33,
  },
  intro: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 20,
  },
  currentDeckHeading: { marginTop: 24 },
  currentDeckTitle: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 20,
    lineHeight: 26,
  },
  currentDeckHint: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  count: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 12 },
  countText: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 12,
  },
  track: {
    height: 7,
    flex: 1,
    borderRadius: 999,
    backgroundColor: RememberCatColors.muted,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: RememberCatColors.primary, borderRadius: 999 },
  list: { flex: 1 },
  listContent: { paddingBottom: 12, flexGrow: 1 },
});
