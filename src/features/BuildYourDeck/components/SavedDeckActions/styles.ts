import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  actions: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  hint: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  startButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: RememberCatColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonDisabled: {
    opacity: 0.42,
  },
  startText: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
  },
  startArrow: {
    position: 'absolute',
    right: 19,
    color: RememberCatColors.primaryForeground,
    fontSize: 22,
  },
});
