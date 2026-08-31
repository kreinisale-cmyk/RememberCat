import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  top: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    fontSize: 30,
    lineHeight: 36,
    color: RememberCatColors.mutedForeground,
  },
  progressLabel: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 12,
  },
  heading: {
    marginTop: 18,
    marginBottom: 20,
  },
  kicker: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    letterSpacing: 1.1,
    fontSize: 11,
  },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -1.1,
    marginTop: 5,
  },
  hint: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  board: {
    flexDirection: 'row',
    gap: 11,
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    gap: 10,
  },
});
