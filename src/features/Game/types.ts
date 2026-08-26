import { WordPair } from '@/features/GameSession/types';

export enum GameStage {
  Preparation = 'preparation',
  EasyReinforcement = 'easy-reinforcement',
  MainRound = 'main-round',
  TimedRoundTransition = 'timed-round-transition',
  ChallengeFailed = 'challenge-failed',
  PracticeTransition = 'practice-transition',
  DifficultWordsPractice = 'difficult-words-practice',
  FinalQuizTransition = 'final-quiz-transition',
  FinalQuiz = 'final-quiz',
  LearningStatistics = 'learning-statistics',
}

export enum MatchFeedback {
  None = 'none',
  Correct = 'correct',
  Incorrect = 'incorrect',
}

export enum ReinforcementFeedback {
  None = 'none',
  Correct = 'correct',
  Incorrect = 'incorrect',
}

export enum MatchCelebrationAnimation {
  Burst = 'burst',
  Shatter = 'shatter',
  Portal = 'portal',
}

export enum FinalQuizFeedback {
  None = 'none',
  Correct = 'correct',
  Miss = 'miss',
}

export enum TimedRoundPhase {
  FourCards = 1,
  FiveCards = 2,
  SixCards = 3,
}

export type GameBoardPair = {
  boardPairId: string;
  wordPairId: string;
  word: string;
  translation: string;
};

export type SelectedBoardPair = {
  wordBoardPairId: string | null;
  translationBoardPairId: string | null;
};

export type WordPairMismatchStatistics = {
  wordPairId: string;
  mismatchCount: number;
};

export type FinalQuizAnswerChoice = {
  wordPairId: string;
  translation: string;
};

export type ReinforcementAnswerChoice = {
  wordPairId: string;
  translation: string;
};

export type WordPairLearningStatistics = WordPair & {
  mismatchCount: number;
  isPracticed: boolean;
};
