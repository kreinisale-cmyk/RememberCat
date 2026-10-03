import { useRef, useState } from 'react';

import { LongWordReviewMode, LongWordReviewPair } from '../types';
import { createLongWordReviewKey } from '../utils';

type LongWordReviewState = {
  mode: LongWordReviewMode;
  reviewKey: string;
};

const INITIAL_REVIEW_STATE: LongWordReviewState = {
  mode: LongWordReviewMode.Editing,
  reviewKey: '',
};

export function useLongWordReview(reviewPairs: LongWordReviewPair[]) {
  const [reviewState, setReviewState] = useState<LongWordReviewState>(INITIAL_REVIEW_STATE);
  const isConfirmingRef = useRef(false);
  const currentReviewKey = createLongWordReviewKey(reviewPairs);
  const isReviewing =
    reviewPairs.length > 0 &&
    reviewState.mode === LongWordReviewMode.Reviewing &&
    reviewState.reviewKey === currentReviewKey;

  function requestReview() {
    if (!reviewPairs.length) return false;

    isConfirmingRef.current = false;
    setReviewState({ mode: LongWordReviewMode.Reviewing, reviewKey: currentReviewKey });

    return true;
  }

  function cancelReview() {
    isConfirmingRef.current = false;
    setReviewState(INITIAL_REVIEW_STATE);
  }

  function confirmReview(onConfirm: () => void) {
    if (!isReviewing || isConfirmingRef.current) return;

    isConfirmingRef.current = true;
    setReviewState(INITIAL_REVIEW_STATE);
    onConfirm();
  }

  return { isReviewing, requestReview, cancelReview, confirmReview };
}
