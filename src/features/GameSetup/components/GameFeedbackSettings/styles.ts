import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { gap: 10 },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
  label: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 14,
  },
  hint: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  divider: { height: 1, backgroundColor: RememberCatColors.border },
  error: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
  },
});
