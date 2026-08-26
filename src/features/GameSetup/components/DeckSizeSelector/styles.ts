import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 5,
    borderRadius: 14,
    backgroundColor: '#f8e4d4',
    padding: 4,
  },
  option: {
    minWidth: 42,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    paddingHorizontal: 8,
  },
  selectedOption: {
    backgroundColor: '#573733',
  },
  optionText: {
    color: '#916d61',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
});
