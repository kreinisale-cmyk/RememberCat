import { CompletedGameWordResult } from '../../../../types';
import { MASTERY_EXPAND_LABEL_PREFIX } from './constants';

export function createMasteryExpandLabel(wordCount: number) {
  return `${MASTERY_EXPAND_LABEL_PREFIX} (${wordCount})`;
}

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

export function selectVisibleMasteryWordResults(
  wordResults: CompletedGameWordResult[],
  visibleWordCount: number,
  isExpanded: boolean,
) {
  if (isExpanded) {
    return wordResults;
  }

  return wordResults.slice(0, visibleWordCount);
}
