import { WordPairLearningStatistics } from '../../types';

export type LearningStatisticsProps = {
  learningStatistics: WordPairLearningStatistics[];
  practicePairCount: number;
  onReturnToSetup: () => void;
};
