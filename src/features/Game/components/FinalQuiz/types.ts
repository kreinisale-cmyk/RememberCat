import { WordPair } from '@/features/GameSession/types';

import { FinalQuizAnswerChoice, FinalQuizFeedback } from '../../types';

export type FinalQuizProps = {
  questionWordPair: WordPair;
  answerChoices: FinalQuizAnswerChoice[];
  feedback: FinalQuizFeedback;
  selectedAnswerId: string | null;
  passedWordPairCount: number;
  totalWordPairCount: number;
  onClose: () => void;
  onSelectAnswer: (wordPairId: string) => void;
};
