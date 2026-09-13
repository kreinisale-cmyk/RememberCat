import {
  FinalQuizAnswerChoice,
  FinalQuizFeedback,
  FocusedReviewState,
  GameBoardPair,
  GameStage,
  MatchCelebrationAnimation,
  MatchFeedback,
  ReinforcementAnswerChoice,
  ReinforcementFeedback,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairLearningStatistics,
  CompletedGameResult,
} from '../../types';
import { CompletedWordStatistic, WordPair } from '@/features/GameSession/types';

export type UseMatchingGameResult = {
  gameStage: GameStage;
  currentPreparationWordPair: WordPair | null;
  preparationWordIndex: number;
  preparationWordCount: number;
  currentReinforcementWordPair: WordPair | null;
  reinforcementWordIndex: number;
  reinforcementWordCount: number;
  reinforcementCorrectRepetitionCount: number;
  reinforcementRepetitionGoal: number;
  reinforcementAnswerChoices: ReinforcementAnswerChoice[];
  reinforcementFeedback: ReinforcementFeedback;
  selectedReinforcementAnswerId: string | null;
  isLearnedWordCelebrationVisible: boolean;
  gameBoard: GameBoardPair[];
  translationBoardPairs: GameBoardPair[];
  completedWordBoardPairIds: string[];
  completedTranslationBoardPairIds: string[];
  selectedBoardPair: SelectedBoardPair;
  matchFeedback: MatchFeedback;
  matchCelebrationAnimation: MatchCelebrationAnimation | null;
  secondsRemaining: number;
  mainRoundScore: number;
  mainRoundProgress: number;
  practiceRoundProgress: number;
  completedPracticePairCount: number;
  practicePairCount: number;
  isTimedMainRound: boolean;
  matchCompletionCountdown: number | null;
  timedRoundPhase: TimedRoundPhase;
  timedRoundTransitionPhase: TimedRoundPhase | null;
  learningStatistics: WordPairLearningStatistics[];
  currentFinalQuizQuestion: WordPair | null;
  finalQuizAnswerChoices: FinalQuizAnswerChoice[];
  finalQuizFeedback: FinalQuizFeedback;
  selectedFinalQuizAnswerId: string | null;
  passedFinalQuizWordPairCount: number;
  finalQuizWordPairCount: number;
  completedWordStatistics: CompletedWordStatistic[];
  focusedReviewAssessmentStatistics: CompletedWordStatistic[];
  focusedReviewWordStatistics: CompletedWordStatistic[];
  focusedReviewState: FocusedReviewState;
  gameResult: CompletedGameResult | null;
  acknowledgePreparationWord: () => void;
  skipPreparation: () => void;
  selectReinforcementAnswer: (wordPairId: string) => void;
  selectWordCard: (boardPairId: string) => void;
  selectTranslationCard: (boardPairId: string) => void;
  selectFinalQuizAnswer: (wordPairId: string) => void;
  retryChallengeStage: () => void;
  startDifficultWordsPractice: () => void;
  startFinalQuiz: () => void;
  continueTimedRound: () => void;
  startFocusedReview: () => void;
};
