import { View } from 'react-native';

import { styles } from './styles';
import { ProgressTrackProps } from './types';
import { createMilestonePosition, createProgressWidth } from './utils';

export function ProgressTrack({ progress, milestones = [] }: ProgressTrackProps) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: createProgressWidth(progress) }]} />
      {milestones.map((milestone) => (
        <View
          key={milestone}
          style={[
            styles.milestone,
            { left: createMilestonePosition(milestone) },
            progress >= milestone && styles.completedMilestone,
          ]}
        />
      ))}
    </View>
  );
}
