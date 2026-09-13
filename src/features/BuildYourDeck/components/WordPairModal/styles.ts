import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: RememberCatColors.scrim,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: RememberCatColors.card,
    borderRadius: 28,
    padding: 24,
    shadowColor: RememberCatColors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 9,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    letterSpacing: 1.3,
    fontSize: 10,
  },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 25,
    marginTop: 3,
  },
  close: { color: RememberCatColors.mutedForeground, fontSize: 29 },
  description: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
    marginBottom: 14,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: RememberCatColors.inputBackground,
    borderWidth: 1,
    borderColor: RememberCatColors.border,
    paddingHorizontal: 14,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.body,
    fontSize: 15,
    marginTop: 9,
  },
  error: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
  },
  saveButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: RememberCatColors.primary,
    marginTop: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: { opacity: 0.42 },
  saveText: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
  },
  saveArrow: {
    position: 'absolute',
    right: 19,
    color: RememberCatColors.primaryForeground,
    fontSize: 22,
  },
});
