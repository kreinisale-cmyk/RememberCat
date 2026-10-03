import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: RememberCatColors.muted,
    padding: 4,
    borderRadius: 16,
    flexDirection: 'row',
  },
  option: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  selectedOption: {
    borderWidth: 1,
    borderColor: RememberCatColors.selectedBackground,
    backgroundColor: RememberCatColors.card,
  },
  text: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 15,
  },
  selectedText: { color: RememberCatColors.primary },
});
