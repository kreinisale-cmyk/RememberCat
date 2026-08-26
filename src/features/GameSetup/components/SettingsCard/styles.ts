import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0ddd1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#9c6e5d',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  copy: { flex: 1, paddingRight: 10 },
  title: { color: '#563832', fontSize: 16, fontWeight: '800' },
  detail: { color: '#96756a', fontSize: 12, marginTop: 4 },
});
