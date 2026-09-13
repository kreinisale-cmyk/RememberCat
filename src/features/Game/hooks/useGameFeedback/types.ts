import { FinalQuizFeedback, GameStage, MatchFeedback, ReinforcementFeedback } from '../../types';

export type UseGameFeedbackOptions = {
  hasActiveSession: boolean;
  gameStage: GameStage;
  preparationWordIndex: number;
  matchFeedback: MatchFeedback;
  reinforcementFeedback: ReinforcementFeedback;
  finalQuizFeedback: FinalQuizFeedback;
};

export type UseGameFeedbackResult = {
  announcePreparationWordLearned: () => void;
};

export enum GameOutcomeFeedback {
  Correct = 'correct',
  Incorrect = 'incorrect',
  ChallengeFailed = 'challenge-failed',
  SessionComplete = 'session-complete',
}
