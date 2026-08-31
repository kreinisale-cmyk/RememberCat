import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  icon: { color: RememberCatColors.primaryMuted, fontSize: 43 },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
  },
  description: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 13,
    marginTop: 6,
  },
});
