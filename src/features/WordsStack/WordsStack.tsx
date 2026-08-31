import { Stack } from 'expo-router';

import { WORDS_STACK_SCREEN_OPTIONS } from './constants';

export function WordsStack() {
  return <Stack screenOptions={WORDS_STACK_SCREEN_OPTIONS} />;
}
