import { DeckSize } from '@/features/GameSession/types';

import { ADD_NEW_WORDS_DETAIL_PREFIX, EDIT_WORD_LIST_DETAIL_PREFIX } from './constants';

export function createAddNewWordsDetail(deckSize: DeckSize) {
  return `${ADD_NEW_WORDS_DETAIL_PREFIX} ${deckSize} words`;
}

export function createEditWordListDetail(savedDeckName: string) {
  return `${EDIT_WORD_LIST_DETAIL_PREFIX}: ${savedDeckName}`;
}
