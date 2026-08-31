import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    borderRadius: 16,
    backgroundColor: RememberCatColors.muted,
    padding: 4,
  },
  option: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingHorizontal: 8,
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: RememberCatColors.selectedBackground,
    backgroundColor: RememberCatColors.card,
  },
  optionText: {
    color: RememberCatColors.mutedForeground,
    fontSize: 15,
    lineHeight: 19,
    fontFamily: RememberCatFonts.bodyBold,
  },
  selectedOptionText: {
    color: RememberCatColors.primary,
  },
});
