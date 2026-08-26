import { ReinforcementFeedback } from '../../types';
import { REINFORCEMENT_PROGRESS_SEPARATOR } from './constants';

export function createReinforcementWordProgressLabel(
  currentWordNumber: number,
  totalWordCount: number,
) {
  return `${currentWordNumber} ${REINFORCEMENT_PROGRESS_SEPARATOR} ${totalWordCount}`;
}

export function getReinforcementProgress(
  currentWordNumber: number,
  totalWordCount: number,
  correctRepetitionCount: number,
  repetitionGoal: number,
) {
  if (totalWordCount <= 0 || repetitionGoal <= 0) {
    return 0;
  }

  const completedWordCount = currentWordNumber - 1;
  const currentWordProgress = correctRepetitionCount / repetitionGoal;

  return Math.min((completedWordCount + currentWordProgress) / totalWordCount, 1);
}

export function getAnswerChoiceFeedback(
  answerChoiceId: string,
  selectedAnswerId: string | null,
  feedback: ReinforcementFeedback,
) {
  if (answerChoiceId !== selectedAnswerId) {
    return ReinforcementFeedback.None;
  }

  return feedback;
}
