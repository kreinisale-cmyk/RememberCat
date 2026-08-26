import { ADD_WORDS_LABEL, DECK_FULL_LABEL } from './constants';

export function createAddWordsLabel(isDeckFull: boolean) {
  if (isDeckFull) {
    return DECK_FULL_LABEL;
  }

  return ADD_WORDS_LABEL;
}
