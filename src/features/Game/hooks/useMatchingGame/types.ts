import {
  FinalQuizAnswerChoice,
  FinalQuizFeedback,
  GameBoardPair,
  GameStage,
  MatchCelebrationAnimation,
  MatchFeedback,
  ReinforcementAnswerChoice,
  ReinforcementFeedback,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairLearningStatistics,
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
  acknowledgePreparationWord: () => void;
  selectReinforcementAnswer: (wordPairId: string) => void;
  selectWordCard: (boardPairId: string) => void;
  selectTranslationCard: (boardPairId: string) => void;
  selectFinalQuizAnswer: (wordPairId: string) => void;
  retryChallengeStage: () => void;
  startDifficultWordsPractice: () => void;
  startFinalQuiz: () => void;
  continueTimedRound: () => void;
};
