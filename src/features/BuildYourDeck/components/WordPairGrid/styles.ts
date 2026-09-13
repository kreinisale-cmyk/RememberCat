import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  card: {
    width: '48.5%',
    backgroundColor: RememberCatColors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: RememberCatColors.border,
    padding: 11,
    marginBottom: 2,
    shadowColor: RememberCatColors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  number: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 9,
    letterSpacing: 0.9,
  },
  remove: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 10,
  },
  input: {
    height: 40,
    borderRadius: 13,
    backgroundColor: RememberCatColors.inputBackground,
    borderWidth: 1,
    borderColor: RememberCatColors.border,
    paddingHorizontal: 9,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.body,
    fontSize: 12,
    marginTop: 6,
  },
  inputConflict: { borderColor: RememberCatColors.primary },
  error: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 9,
    lineHeight: 13,
    marginTop: 3,
  },
});
