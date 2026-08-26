import { Platform } from 'react-native';

export function getModalKeyboardBehavior() {
  return Platform.OS === 'ios' ? 'padding' : 'height';
}

export function createBulkWordPairModalDescription(wordPairLimit: number) {
  return `One pair per line, like cat - gato. We’ll fill up to ${wordPairLimit} words.`;
}
