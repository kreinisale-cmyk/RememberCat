import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerText: { flex: 1, paddingRight: 12 },
  kicker: {
    color: '#a56400',
    fontFamily: RememberCatFonts.bodyExtraBold,
    letterSpacing: 1.3,
    fontSize: 10,
  },
  title: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 24,
    lineHeight: 29,
    marginTop: 3,
  },
  close: { color: RememberCatColors.mutedForeground, fontSize: 29 },
  description: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  list: { maxHeight: 270, marginTop: 14 },
  listContent: { gap: 9, paddingBottom: 2 },
  pairCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dfad4b',
    backgroundColor: '#fff3d6',
    padding: 12,
  },
  lineNumber: {
    color: '#8b5700',
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  pairText: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 14,
    lineHeight: 20,
  },
  findingList: { gap: 3, marginTop: 7 },
  findingText: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 12,
    lineHeight: 18,
  },
  longWord: { color: '#8b5700', fontFamily: RememberCatFonts.bodyExtraBold },
  actions: { gap: 9, marginTop: 16 },
  confirmButton: {
    minHeight: 54,
    borderRadius: 17,
    backgroundColor: RememberCatColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  confirmText: {
    color: RememberCatColors.primaryForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 16,
  },
  editButton: {
    minHeight: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: RememberCatColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  editText: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 14,
  },
});
