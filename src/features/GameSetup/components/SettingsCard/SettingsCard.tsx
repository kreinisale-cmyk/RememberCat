import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { styles } from './styles';
import { SettingsCardProps } from './types';
import { getSettingsCardAccessibilityLabel } from './utils';

export function SettingsCard({ title, detail, children }: SettingsCardProps) {
  return (
    <View style={styles.card} accessibilityLabel={getSettingsCardAccessibilityLabel(title)}>
      <View style={styles.copy}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.detail}>{detail}</ThemedText>
      </View>
      {children}
    </View>
  );
}
