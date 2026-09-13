import {
  CompletedAssessmentStatistic,
  GameSession,
  MasteryLevel,
  WordMastery,
  WordPair,
} from './types';

import { DEFAULT_GAME_SESSION } from './constants';

export function createInitialGameSession(): GameSession {
  return { ...DEFAULT_GAME_SESSION, pairs: [] };
}

export function isCompleteWordPair(pair: WordPair) {
  return Boolean(pair.word.trim() && pair.translation.trim());
}

export function cloneWordPairs(pairs: WordPair[]) {
  return pairs.map((pair) => ({ ...pair }));
}

export function getMasteryLevel(
  completedAssessmentCount: number,
  latestAccuracy: number,
  cleanAssessmentStreak: number,
) {
  if (completedAssessmentCount === 0) {
    return MasteryLevel.New;
  } else if (cleanAssessmentStreak >= 2) {
    return MasteryLevel.Mastered;
  } else if (latestAccuracy >= 80) {
    return MasteryLevel.Familiar;
  }

  return MasteryLevel.Learning;
}

export function createNewWordMastery(savedDeckId: string, wordPairId: string): WordMastery {
  return {
    savedDeckId,
    wordPairId,
    completedAssessmentCount: 0,
    lifetimeCorrectAttemptCount: 0,
    lifetimeIncorrectAttemptCount: 0,
    cleanAssessmentStreak: 0,
    latestAccuracy: 0,
    lastSeenAt: 0,
    lastMissedAt: null,
    level: MasteryLevel.New,
  };
}

export function applyAssessmentToWordMastery(
  previousMastery: WordMastery,
  assessment: CompletedAssessmentStatistic,
  completedAt: number,
): WordMastery {
  if (assessment.totalAttemptCount === 0) {
    return previousMastery;
  }

  const incorrectAttemptCount = assessment.totalAttemptCount - assessment.correctAttemptCount;
  const completedAssessmentCount = previousMastery.completedAssessmentCount + 1;
  const cleanAssessmentStreak =
    assessment.accuracy === 100 ? previousMastery.cleanAssessmentStreak + 1 : 0;

  return {
    ...previousMastery,
    completedAssessmentCount,
    lifetimeCorrectAttemptCount:
      previousMastery.lifetimeCorrectAttemptCount + assessment.correctAttemptCount,
    lifetimeIncorrectAttemptCount:
      previousMastery.lifetimeIncorrectAttemptCount + incorrectAttemptCount,
    cleanAssessmentStreak,
    latestAccuracy: assessment.accuracy,
    lastSeenAt: completedAt,
    lastMissedAt: incorrectAttemptCount > 0 ? completedAt : previousMastery.lastMissedAt,
    level: getMasteryLevel(completedAssessmentCount, assessment.accuracy, cleanAssessmentStreak),
  };
}
