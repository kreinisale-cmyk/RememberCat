import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 18,
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
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -1.1,
    marginTop: 7,
  },
  description: {
    color: '#916e63',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  button: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: '#50342f',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 22,
  },
});
