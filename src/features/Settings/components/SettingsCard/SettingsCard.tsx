import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { SETTINGS_CARD_ICON_SIZE } from './constants';
import { styles } from './styles';
import { SettingsCardIconTone, SettingsCardProps } from './types';
import { getSettingsCardAccessibilityLabel } from './utils';

export function SettingsCard({
  title,
  detail,
  children,
  badge,
  icon: Icon,
  iconTone = SettingsCardIconTone.Secondary,
}: SettingsCardProps) {
  return (
    <View style={styles.card} accessibilityLabel={getSettingsCardAccessibilityLabel(title)}>
      <View style={styles.headingRow}>
        {Icon ? (
          <View
            style={[styles.icon, iconTone === SettingsCardIconTone.Accent && styles.accentIcon]}
          >
            <Icon
              size={SETTINGS_CARD_ICON_SIZE}
              color={
                iconTone === SettingsCardIconTone.Accent
                  ? RememberCatColors.accentForeground
                  : RememberCatColors.secondaryForeground
              }
              strokeWidth={2.4}
            />
          </View>
        ) : null}
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {badge ? <ThemedText style={styles.badge}>{badge}</ThemedText> : null}
          </View>
          <ThemedText style={styles.detail}>{detail}</ThemedText>
        </View>
      </View>
      <View style={styles.control}>{children}</View>
    </View>
  );
}
