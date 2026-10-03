import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#ffe8db',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  catBadge: {
    width: 126,
    height: 126,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 63,
    borderWidth: 2,
    borderColor: RememberCatColors.primaryBorder,
    backgroundColor: RememberCatColors.card,
  },
  copy: {
    alignItems: 'center',
    marginTop: 28,
  },
  kicker: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 13,
    letterSpacing: 1.7,
    lineHeight: 18,
    textAlign: 'center',
  },
  title: {
    maxWidth: 330,
    marginTop: 10,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 38,
    lineHeight: 44,
    textAlign: 'center',
  },
  sparkleLeft: {
    position: 'absolute',
    top: '27%',
    left: '17%',
    transform: [{ rotate: '-12deg' }],
  },
  sparkleRight: {
    position: 'absolute',
    top: '21%',
    right: '17%',
    transform: [{ rotate: '15deg' }],
  },
});
