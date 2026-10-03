import { FinalQuizFeedback, GameStage, MatchFeedback, ReinforcementFeedback } from '../../types';
import { GameOutcomeFeedback, UseGameFeedbackOptions } from './types';

export function createShuffledSoundBag(
  itemCount: number,
  previousIndex: number | null,
  random: () => number = Math.random,
) {
  const indices = Array.from({ length: itemCount }, (_, index) => index);

  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }

  if (indices.length > 1 && indices[0] === previousIndex) {
    const swapIndex = 1 + Math.floor(random() * (indices.length - 1));
    [indices[0], indices[swapIndex]] = [indices[swapIndex], indices[0]];
  }

  return indices;
}

export function isAnswerOutcome(outcome: GameOutcomeFeedback) {
  return outcome === GameOutcomeFeedback.Correct || outcome === GameOutcomeFeedback.Incorrect;
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
