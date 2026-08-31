import { StyleSheet } from 'react-native';

import { RememberCatColors } from '@/constants/theme';

export const styles = StyleSheet.create({
  track: {
    flex: 1,
    height: 12,
    overflow: 'visible',
    borderRadius: 9,
    backgroundColor: RememberCatColors.muted,
  },
  fill: {
    height: '100%',
    borderRadius: 9,
    backgroundColor: RememberCatColors.primary,
  },
  milestone: {
    position: 'absolute',
    top: -3,
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: RememberCatColors.border,
    backgroundColor: RememberCatColors.background,
  },
  completedMilestone: {
    borderColor: RememberCatColors.primary,
    backgroundColor: RememberCatColors.primary,
  },
});
