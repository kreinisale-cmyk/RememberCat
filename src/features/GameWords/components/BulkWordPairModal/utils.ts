import { Platform } from 'react-native';

export function getModalKeyboardBehavior() {
  return Platform.OS === 'ios' ? 'padding' : 'height';
}
