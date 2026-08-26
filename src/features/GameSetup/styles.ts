import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff8f1', paddingHorizontal: 22 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingTop: 8,
  },
  body: { flex: 1 },
  bodyContent: { paddingBottom: 24 },
  back: { fontSize: 40, lineHeight: 38, color: '#51342f' },
  kicker: {
    color: '#d77c70',
    fontWeight: '800',
    letterSpacing: 1.3,
    fontSize: 10,
  },
  title: {
    color: '#51342f',
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  intro: {
    color: '#87675d',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 25,
    maxWidth: 320,
  },
  cards: { gap: 12, marginTop: 28 },
});
