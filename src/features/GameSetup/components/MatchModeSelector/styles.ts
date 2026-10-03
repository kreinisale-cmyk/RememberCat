import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  animatedContainer: {
    overflow: 'hidden',
    borderWidth: 2,
    borderRadius: 20,
    padding: 6,
    shadowColor: RememberCatColors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  button: {
    borderRadius: 14,
  },
  pressedButton: {
    opacity: 0.84,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 253, 248, 0.76)',
    padding: 10,
  },
  catTile: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mode: {
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: 1,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 17,
    lineHeight: 21,
  },
  hint: {
    marginTop: 1,
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 10,
    lineHeight: 14,
  },
  status: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  statusContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: RememberCatColors.primaryForeground,
  },
});
