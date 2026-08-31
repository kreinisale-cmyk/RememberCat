import { View } from 'react-native';

import { APP_TAB_ICON_SIZE } from './constants';
import { styles } from './styles';
import { AppTabIconProps } from './types';

export function AppTabIcon({ color, focused, icon: Icon }: AppTabIconProps) {
  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Icon size={APP_TAB_ICON_SIZE} color={color} strokeWidth={2.4} />
    </View>
  );
}
