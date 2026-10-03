import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: RememberCatColors.card,
    borderWidth: 1,
    borderColor: RememberCatColors.border,
    shadowColor: RememberCatColors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: RememberCatColors.secondary,
  },
  accentIcon: { backgroundColor: RememberCatColors.accent },
  copy: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 18,
  },
  detail: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 2,
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: RememberCatColors.selectedBackground,
    color: RememberCatColors.primary,
    fontSize: 12,
    fontFamily: RememberCatFonts.bodyBold,
  },
  control: { marginTop: 16 },
});
