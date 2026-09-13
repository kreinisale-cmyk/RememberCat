import { FinalQuizFeedback, GameStage, MatchFeedback, ReinforcementFeedback } from '../../types';
import { GameOutcomeFeedback, UseGameFeedbackOptions } from './types';

export function selectRandomIndex(itemCount: number) {
  return Math.floor(Math.random() * itemCount);
}

export function didMatchingOutcomeChange(
  current: UseGameFeedbackOptions,
  previous: UseGameFeedbackOptions,
) {
  return (
    current.matchFeedback !== previous.matchFeedback && current.matchFeedback !== MatchFeedback.None
  );
}

export function selectGameOutcomeFeedback(
  current: UseGameFeedbackOptions,
  previous: UseGameFeedbackOptions,
): GameOutcomeFeedback | null {
  if (
    current.matchFeedback !== previous.matchFeedback &&
    current.matchFeedback !== MatchFeedback.None
  ) {
    if (current.matchFeedback === MatchFeedback.Correct) {
      return GameOutcomeFeedback.Correct;
    }

    return GameOutcomeFeedback.Incorrect;
  }

  if (
    current.reinforcementFeedback !== previous.reinforcementFeedback &&
    current.reinforcementFeedback !== ReinforcementFeedback.None
  ) {
    if (current.reinforcementFeedback === ReinforcementFeedback.Correct) {
      return GameOutcomeFeedback.Correct;
    }

    return GameOutcomeFeedback.Incorrect;
  }

  if (
    current.finalQuizFeedback !== previous.finalQuizFeedback &&
    current.finalQuizFeedback !== FinalQuizFeedback.None
  ) {
    if (current.finalQuizFeedback === FinalQuizFeedback.Correct) {
      return GameOutcomeFeedback.Correct;
    }

    return GameOutcomeFeedback.Incorrect;
  }

  if (
    current.gameStage === GameStage.ChallengeFailed &&
    previous.gameStage !== GameStage.ChallengeFailed
  ) {
    return GameOutcomeFeedback.ChallengeFailed;
  }

  if (
    current.gameStage === GameStage.LearningStatistics &&
    previous.gameStage !== GameStage.LearningStatistics
  ) {
    return GameOutcomeFeedback.SessionComplete;
  }

  return null;
}
