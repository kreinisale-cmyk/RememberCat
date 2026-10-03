import { LongWordReviewPair } from '../../types';

export type LongWordReviewProps = {
  reviewPairs: LongWordReviewPair[];
  isBatch?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
