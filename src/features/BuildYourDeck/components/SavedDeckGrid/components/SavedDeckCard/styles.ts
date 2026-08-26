import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    minHeight: 150,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bcded5',
    backgroundColor: '#e7f6f2',
    padding: 14,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#d77c70',
    backgroundColor: '#fff0e4',
    padding: 13,
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  cardTop: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  count: {
    color: '#317c6b',
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    paddingTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9c3b9',
    backgroundColor: '#fffaf6',
  },
  actionButtonPressed: {
    opacity: 0.68,
    transform: [{ scale: 0.92 }],
  },
  editIcon: {
    color: '#8d6258',
    fontSize: 17,
    lineHeight: 18,
    fontWeight: '900',
  },
  deleteIcon: {
    color: '#c75f55',
    fontSize: 20,
    lineHeight: 21,
    fontWeight: '700',
  },
  name: {
    color: '#3f5f58',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  nameSelected: {
    color: '#70483f',
  },
  preview: {
    color: '#66877f',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 7,
  },
  previewSelected: {
    color: '#8e675d',
  },
});
