import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollContent: {
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
  actions: {
    gap: 10,
    marginBottom: 14,
  },
  reviewButton: {
    borderRadius: 18,
    backgroundColor: RememberCatColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
    lineHeight: 22,
  },
  reviewComplete: {
    borderRadius: 18,
    backgroundColor: RememberCatColors.successBackground,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  reviewCompleteText: {
    color: RememberCatColors.success,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 14,
  },
  returnButton: {
    borderRadius: 18,
    borderColor: RememberCatColors.border,
    borderWidth: 1,
    backgroundColor: RememberCatColors.card,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  returnButtonText: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
    lineHeight: 22,
  },
});
