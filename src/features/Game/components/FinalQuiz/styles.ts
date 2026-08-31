import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: RememberCatColors.background,
  },
  top: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  closeButton: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    color: RememberCatColors.mutedForeground,
    fontSize: 30,
    lineHeight: 36,
  },
  track: {
    flex: 1,
    height: 10,
    overflow: 'hidden',
    borderRadius: 9,
    backgroundColor: RememberCatColors.muted,
  },
  fill: {
    height: '100%',
    borderRadius: 9,
    backgroundColor: RememberCatColors.primary,
  },
  progressLabel: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.bodyExtraBold,
    fontSize: 12,
    lineHeight: 18,
  },
  quizBody: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  question: {
    minHeight: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  promptLabel: {
    color: RememberCatColors.primary,
    fontFamily: RememberCatFonts.bodyExtraBold,
    letterSpacing: 1.5,
    fontSize: 12,
    lineHeight: 18,
  },
  promptWord: {
    width: '100%',
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.displaySemiBold,
    fontSize: 54,
    lineHeight: 64,
    letterSpacing: -1.8,
    textAlign: 'center',
    marginTop: 7,
  },
  answerList: {
    gap: 8,
  },
});
