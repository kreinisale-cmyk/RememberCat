import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 14,
    lineHeight: 19,
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: RememberCatColors.selectedBackground,
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 18,
    backgroundColor: RememberCatColors.border,
  },
  description: {
    marginTop: 10,
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
