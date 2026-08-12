import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 12,
    overflow: 'visible',
    borderRadius: 9,
    backgroundColor: '#f0ddd1',
  },
  fill: {
    height: '100%',
    borderRadius: 9,
    backgroundColor: '#d98072',
  },
  milestone: {
    position: 'absolute',
    top: -3,
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: '#d8bdb1',
    backgroundColor: '#fff8f1',
  },
  completedMilestone: {
    borderColor: '#c9695e',
    backgroundColor: '#d98072',
  },
});
