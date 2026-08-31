import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 18,
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
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1.1,
    marginTop: 7,
  },
  description: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  button: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: RememberCatColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
    lineHeight: 22,
  },
});
