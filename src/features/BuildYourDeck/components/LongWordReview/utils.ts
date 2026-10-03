import { WordPairField } from '../../types';
import { LONG_WORD_REVIEW_COPY } from './constants';

export function createLongWordReviewConfirmLabel(pairCount: number, isBatch = false) {
  return pairCount === 1 && !isBatch
    ? LONG_WORD_REVIEW_COPY.confirmSingle
    : LONG_WORD_REVIEW_COPY.confirmMultiple;
}

export function createLongWordFindingLabel(field: WordPairField) {
  return field === WordPairField.Word
    ? LONG_WORD_REVIEW_COPY.wordField
    : LONG_WORD_REVIEW_COPY.translationField;
}
