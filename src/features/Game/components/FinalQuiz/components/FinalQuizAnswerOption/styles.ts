import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 54,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: RememberCatColors.border,
    backgroundColor: RememberCatColors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: RememberCatColors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: RememberCatColors.selectedBackground,
  },
  correctButton: {
    borderColor: RememberCatColors.success,
    backgroundColor: RememberCatColors.success,
    shadowColor: '#2d7d42',
    shadowOpacity: 0.24,
    elevation: 5,
  },
  incorrectButton: {
    borderColor: RememberCatColors.destructive,
    backgroundColor: RememberCatColors.destructiveBackground,
  },
  label: {
    flexShrink: 1,
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'center',
  },
  correctLabel: {
    color: RememberCatColors.successForeground,
  },
  incorrectLabel: {
    color: RememberCatColors.destructive,
  },
  check: {
    color: RememberCatColors.successForeground,
    fontWeight: '900',
    fontSize: 18,
    lineHeight: 22,
    marginLeft: 7,
  },
});
