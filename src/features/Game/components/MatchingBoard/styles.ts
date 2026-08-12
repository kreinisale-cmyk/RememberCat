import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontSize: 30,
    lineHeight: 36,
    color: '#9a776c',
  },
  progressLabel: {
    color: '#9a776c',
    fontWeight: '800',
    fontSize: 12,
  },
  heading: {
    marginTop: 18,
    marginBottom: 20,
  },
  kicker: {
    color: '#d17c70',
    fontWeight: '800',
    letterSpacing: 1.1,
    fontSize: 11,
  },
  title: {
    color: '#50342f',
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -1.1,
    marginTop: 5,
  },
  hint: {
    color: '#916e63',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  board: {
    flexDirection: 'row',
    gap: 11,
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    gap: 10,
  },
});
