import {
  CompletedAssessmentStatistic,
  CompletedWordStatistic,
  WordMastery,
  WordPair,
} from '@/features/GameSession/types';

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

export enum FocusedReviewState {
  Unavailable = 'unavailable',
  Available = 'available',
  Practice = 'practice',
  Quiz = 'quiz',
  Complete = 'complete',
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

export type CompletedGameWordResult = {
  wordPair: WordPair;
  correctAttemptCount: number;
  incorrectAttemptCount: number;
  assessmentCorrectAttemptCount: number;
  assessmentIncorrectAttemptCount: number;
  assessmentAccuracy: number;
  masteryBefore: WordMastery;
  masteryAfter: WordMastery;
};

export type CompletedGameResult = {
  completedAt: number;
  assessmentAccuracy: number;
  assessmentCorrectAttemptCount: number;
  assessmentIncorrectAttemptCount: number;
  totalIncorrectAttemptCount: number;
  missedWordPairIds: string[];
  completedWordStatistics: CompletedWordStatistic[];
  assessmentStatistics: CompletedAssessmentStatistic[];
  learningStatistics: WordPairLearningStatistics[];
  wordResults: CompletedGameWordResult[];
};
