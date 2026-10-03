import { WordPair } from '@/features/GameSession/types';

import { ReinforcementAnswerChoice, ReinforcementFeedback } from '../../types';

export type EasyReinforcementProps = {
  wordPair: WordPair;
  answerChoices: ReinforcementAnswerChoice[];
  currentWordNumber: number;
  totalWordCount: number;
  correctRepetitionCount: number;
  repetitionGoal: number;
  feedback: ReinforcementFeedback;
  selectedAnswerId: string | null;
  isCelebrating: boolean;
  isSkipDisabled: boolean;
  onClose: () => void;
  onSelectAnswer: (wordPairId: string) => void;
  onSkip: () => void;
};
