import {
  FinalQuizAnswerChoice,
  FinalQuizFeedback,
  GameBoardPair,
  GameStage,
  MatchFeedback,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairLearningStatistics,
} from '../../types';
import { WordPair } from '@/features/GameSession/types';

export type UseMatchingGameResult = {
  gameStage: GameStage;
  gameBoard: GameBoardPair[];
  translationBoardPairs: GameBoardPair[];
  selectedBoardPair: SelectedBoardPair;
  matchFeedback: MatchFeedback;
  secondsRemaining: number;
  mainRoundScore: number;
  mainRoundProgress: number;
  practiceRoundProgress: number;
  completedPracticePairCount: number;
  practicePairCount: number;
  isTimedMainRound: boolean;
  timedRoundPhase: TimedRoundPhase;
  timedRoundTransitionPhase: TimedRoundPhase | null;
  learningStatistics: WordPairLearningStatistics[];
  currentFinalQuizQuestion: WordPair | null;
  finalQuizAnswerChoices: FinalQuizAnswerChoice[];
  finalQuizFeedback: FinalQuizFeedback;
  selectedFinalQuizAnswerId: string | null;
  passedFinalQuizWordPairCount: number;
  finalQuizWordPairCount: number;
  selectWordCard: (boardPairId: string) => void;
  selectTranslationCard: (boardPairId: string) => void;
  selectFinalQuizAnswer: (wordPairId: string) => void;
  startDifficultWordsPractice: () => void;
  startFinalQuiz: () => void;
  continueTimedRound: () => void;
};
