import { CompletedGameResult, FocusedReviewState } from '../../types';

export type LearningStatisticsProps = {
  result: CompletedGameResult;
  focusedReviewState: FocusedReviewState;
  onReviewMissedWords: () => void;
  onReturnToSetup: () => void;
};
