import { StyleSheet } from 'react-native';

import { PREPARATION_GRID_GAP, PREPARATION_GRID_PADDING } from './constants';

export const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: PREPARATION_GRID_GAP,
    padding: PREPARATION_GRID_PADDING,
  },
});
