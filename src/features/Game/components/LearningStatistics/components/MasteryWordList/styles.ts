import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    borderRadius: 22,
    borderColor: RememberCatColors.border,
    borderWidth: 1,
    backgroundColor: RememberCatColors.card,
    padding: 16,
  },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 15,
    marginBottom: 8,
  },
  list: { gap: 2 },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopColor: RememberCatColors.border,
    borderTopWidth: 1,
    paddingVertical: 9,
  },
  copy: { flex: 1 },
  word: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 14,
  },
  translation: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 12,
    marginTop: 1,
  },
  attempts: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 10,
    marginTop: 3,
  },
  badge: {
    maxWidth: '45%',
    borderRadius: 999,
    backgroundColor: RememberCatColors.successBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: RememberCatColors.success,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});
