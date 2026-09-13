export type SavedDeckDatabaseRow = {
  id: string;
  name: string;
  pairsJson: string;
  pairCount: number;
  updatedAt: number;
};

export type WordStatisticDatabaseRow = {
  savedDeckId: string;
  wordPairId: string;
  completedGameCount: number;
  bestAccuracy: number;
  bestCorrectAttemptCount: number;
  bestTotalAttemptCount: number;
  lastPlayedAt: number;
};

export type WordMasteryDatabaseRow = {
  savedDeckId: string;
  wordPairId: string;
  completedAssessmentCount: number;
  lifetimeCorrectAttemptCount: number;
  lifetimeIncorrectAttemptCount: number;
  cleanAssessmentStreak: number;
  latestAccuracy: number;
  lastSeenAt: number;
  lastMissedAt: number | null;
};
