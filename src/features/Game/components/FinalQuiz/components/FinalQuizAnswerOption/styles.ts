import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    flexBasis: '48%',
    flexGrow: 1,
    height: 72,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#ead8cc',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#6c4438',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: '#fff1e8',
  },
  correctButton: {
    borderColor: '#49a461',
    backgroundColor: '#49a461',
    shadowColor: '#2d7d42',
    shadowOpacity: 0.24,
    elevation: 5,
  },
  incorrectButton: {
    borderColor: '#d95d59',
    backgroundColor: '#fff0ee',
  },
  label: {
    flexShrink: 1,
    color: '#5d4038',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'center',
  },
  correctLabel: {
    color: '#fff',
  },
  incorrectLabel: {
    color: '#b43f3b',
  },
  check: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    lineHeight: 22,
    marginLeft: 7,
  },
});
