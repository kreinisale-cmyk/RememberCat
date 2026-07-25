import { TextStyle } from 'react-native';

export function getHeartPosition(position: 'left' | 'right'): TextStyle {
  return position === 'left' ? { left: '12%', top: '24%' } : { right: '13%', top: '17%' };
}
