import { CompletedGameWordResult } from '../../../../types';

export function createMasteryChangeLabel(wordResult: CompletedGameWordResult) {
  const previousLevel = wordResult.masteryBefore.level;
  const nextLevel = wordResult.masteryAfter.level;

  if (previousLevel === nextLevel) {
    return nextLevel;
  }

  return `${previousLevel} → ${nextLevel}`;
}

export function createWordAttemptLabel(wordResult: CompletedGameWordResult) {
  return `${wordResult.assessmentAccuracy}% assessment · ${wordResult.incorrectAttemptCount} mistake${
    wordResult.incorrectAttemptCount === 1 ? '' : 's'
  }`;
}
