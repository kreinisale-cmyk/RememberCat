import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  primaryMetric: {
    flex: 1.25,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    borderRadius: 20,
    backgroundColor: RememberCatColors.primary,
    padding: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
    borderRadius: 20,
    borderColor: RememberCatColors.border,
    borderWidth: 1,
    backgroundColor: RememberCatColors.card,
    padding: 12,
  },
  primaryValue: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 25,
  },
  primaryLabel: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
  value: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 24,
  },
  label: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
  },
});
