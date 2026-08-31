import { StyleSheet } from 'react-native';

import {
  APP_TAB_ICON_CONTAINER_RADIUS,
  APP_TAB_ICON_CONTAINER_SIZE,
  APP_TAB_ICON_FOCUSED_BACKGROUND_COLOR,
} from './constants';

export const styles = StyleSheet.create({
  container: {
    width: APP_TAB_ICON_CONTAINER_SIZE,
    height: APP_TAB_ICON_CONTAINER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: APP_TAB_ICON_CONTAINER_RADIUS,
  },
  containerFocused: {
    backgroundColor: APP_TAB_ICON_FOCUSED_BACKGROUND_COLOR,
  },
});
