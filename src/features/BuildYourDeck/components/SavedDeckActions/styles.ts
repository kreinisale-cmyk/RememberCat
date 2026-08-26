import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actions: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  hint: {
    color: '#9a786d',
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 8,
  },
  startButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: '#51342f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#cdb8ae',
  },
  startText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  startArrow: {
    position: 'absolute',
    right: 19,
    color: '#f3bd9f',
    fontSize: 22,
  },
});
