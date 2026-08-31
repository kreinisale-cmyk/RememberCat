import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  wordActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  wordActionButton: {
    flex: 1,
    height: 40,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: RememberCatColors.primaryBorder,
    backgroundColor: RememberCatColors.selectedBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  wordActionButtonDisabled: { opacity: 0.42 },
  addPlus: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 18,
    lineHeight: 19,
  },
  wordActionText: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 12,
  },
  importHint: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    textAlign: 'center',
    fontSize: 11,
    marginTop: 8,
  },
  importMessage: {
    color: RememberCatColors.success,
    fontFamily: RememberCatFonts.bodyBold,
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6,
  },
  startGameButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: RememberCatColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  startGameText: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
  },
  startGameArrow: {
    position: 'absolute',
    right: 19,
    color: RememberCatColors.primaryForeground,
    fontSize: 22,
  },
});
