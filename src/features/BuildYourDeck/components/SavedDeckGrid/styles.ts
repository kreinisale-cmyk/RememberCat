import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  title: {
    color: '#51342f',
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '900',
  },
  hint: {
    color: '#96756a',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  statusCard: {
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e3cfc4',
    backgroundColor: '#fffdf9',
    marginTop: 12,
    paddingHorizontal: 18,
  },
  statusText: {
    color: '#a1847a',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
  },
  createButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d77c70',
    backgroundColor: '#fff0e4',
    marginTop: 14,
  },
  createSymbol: {
    color: '#c66f61',
    fontSize: 21,
    lineHeight: 23,
  },
  createLabel: {
    color: '#9e594f',
    fontWeight: '900',
    fontSize: 14,
  },
});
