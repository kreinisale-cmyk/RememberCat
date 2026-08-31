import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

import { APP_TAB_BAR_BOTTOM_PADDING, APP_TAB_BAR_HEIGHT } from './constants';

export const styles = StyleSheet.create({
  tabBar: {
    height: APP_TAB_BAR_HEIGHT,
    paddingTop: 8,
    paddingBottom: APP_TAB_BAR_BOTTOM_PADDING,
    borderTopWidth: 1,
    borderTopColor: RememberCatColors.border,
    backgroundColor: RememberCatColors.card,
  },
  tabLabel: { fontFamily: RememberCatFonts.bodyBold, fontSize: 11, lineHeight: 15 },
});
