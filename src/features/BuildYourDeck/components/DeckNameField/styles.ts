import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    marginTop: 22,
    backgroundColor: RememberCatColors.card,
    borderColor: RememberCatColors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 13,
  },
  count: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 11,
  },
  input: {
    height: 48,
    marginTop: 9,
    borderRadius: 14,
    borderColor: RememberCatColors.border,
    borderWidth: 1,
    backgroundColor: RememberCatColors.inputBackground,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.body,
    fontSize: 15,
    paddingHorizontal: 13,
  },
  inputError: { borderColor: RememberCatColors.primary },
  error: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
});
