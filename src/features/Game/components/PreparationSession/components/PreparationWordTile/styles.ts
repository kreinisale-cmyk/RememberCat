import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

import { PREPARATION_WORD_TILE_HEIGHT } from './constants';

export const styles = StyleSheet.create({
  tile: {
    width: '31.5%',
    height: PREPARATION_WORD_TILE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    paddingHorizontal: 7,
  },
  preparedTile: {
    borderStyle: 'solid',
    borderColor: RememberCatColors.primaryBorder,
    backgroundColor: RememberCatColors.selectedBackground,
  },
  word: {
    width: '100%',
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  divider: {
    width: 20,
    height: 2,
    marginVertical: 5,
    borderRadius: 1,
    backgroundColor: RememberCatColors.secondary,
  },
  translation: {
    width: '100%',
    color: RememberCatColors.success,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});
