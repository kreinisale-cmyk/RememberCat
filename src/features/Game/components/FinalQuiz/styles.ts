import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff8f1',
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
    color: '#9a776c',
    fontSize: 30,
    lineHeight: 36,
  },
  track: {
    flex: 1,
    height: 10,
    overflow: 'hidden',
    borderRadius: 9,
    backgroundColor: '#f0ddd1',
  },
  fill: {
    height: '100%',
    borderRadius: 9,
    backgroundColor: '#d98072',
  },
  progressLabel: {
    color: '#9a776c',
    fontWeight: '800',
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
    color: '#c56f64',
    fontWeight: '900',
    letterSpacing: 1.5,
    fontSize: 12,
    lineHeight: 18,
  },
  promptWord: {
    width: '100%',
    color: '#50342f',
    fontWeight: '900',
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
