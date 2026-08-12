import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    height: 58,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#efdcd0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  selected: {
    backgroundColor: '#f4d1b5',
    borderColor: '#df8a73',
    shadowColor: '#b86252',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  correct: {
    backgroundColor: '#d8f4d8',
    borderColor: '#55a966',
  },
  incorrect: {
    backgroundColor: '#ffdedb',
    borderColor: '#e35b59',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5d4038',
    fontWeight: '700',
  },
});
