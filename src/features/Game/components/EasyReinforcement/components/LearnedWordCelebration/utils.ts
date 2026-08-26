import { CELEBRATION_MESSAGE_PREFIX } from './constants';

export function createLearnedWordCelebrationMessage(word: string) {
  return `${CELEBRATION_MESSAGE_PREFIX} ${word}!`;
}
