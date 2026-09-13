export enum FocusMode {
  Timed = 'timed',
  Free = 'free',
}

export enum MatchMode {
  Easy = 'easy',
  Hard = 'hard',
}

export enum DeckSize {
  Six = 6,
  Ten = 10,
  Fifteen = 15,
}

export enum GameAttemptPhase {
  GuidedReinforcement = 'guided-reinforcement',
  MainChallenge = 'main-challenge',
  DifficultPractice = 'difficult-practice',
  FinalQuiz = 'final-quiz',
  FocusedReviewPractice = 'focused-review-practice',
  FocusedReviewQuiz = 'focused-review-quiz',
}

export enum MasteryLevel {
  New = 'new',
  Learning = 'learning',
  Familiar = 'familiar',
  Mastered = 'mastered',
}

export enum AssessmentSegment {
  Primary = 'primary',
  FocusedReview = 'focused-review',
}

export enum StartGameSessionStatus {
  Started = 'started',
  InvalidDeck = 'invalid-deck',
  SaveFailed = 'save-failed',
  DuplicateDeck = 'duplicate-deck',
}

export enum SavedDeckPersistenceStatus {
  Saved = 'saved',
  DuplicateDeck = 'duplicate-deck',
  Failed = 'failed',
}

export type WordPair = {
  id: string;
  word: string;
  translation: string;
};

export type GameSession = {
  pairs: WordPair[];
  deckSize: DeckSize;
  focusMode: FocusMode;
  matchMode: MatchMode;
  savedDeckId: string | null;
};

export type SavedDeck = {
  id: string;
  name: string;
  pairs: WordPair[];
  pairCount: DeckSize;
  updatedAt: number;
};

export type WordAttemptStatistic = {
  wordPairId: string;
  attemptsByPhase: Record<GameAttemptPhase, AttemptCount>;
};

export type AttemptCount = {
  correctAttemptCount: number;
  incorrectAttemptCount: number;
};

export type CompletedWordStatistic = {
  wordPairId: string;
  correctAttemptCount: number;
  totalAttemptCount: number;
  accuracy: number;
};

export type CompletedAssessmentStatistic = CompletedWordStatistic;

export type WordMastery = {
  savedDeckId: string;
  wordPairId: string;
  completedAssessmentCount: number;
  lifetimeCorrectAttemptCount: number;
  lifetimeIncorrectAttemptCount: number;
  cleanAssessmentStreak: number;
  latestAccuracy: number;
  lastSeenAt: number;
  lastMissedAt: number | null;
  level: MasteryLevel;
};

export type MasteryChange = {
  wordPairId: string;
  previousLevel: MasteryLevel;
  nextLevel: MasteryLevel;
};

export type PersistAssessmentOptions = {
  savedDeckId: string;
  completedWordStatistics: CompletedWordStatistic[];
  assessmentStatistics: CompletedAssessmentStatistic[];
  seenWordPairIds: string[];
  missedWordPairIds: string[];
  updateBestStatistics: boolean;
};

export type StartGameSessionOptions = {
  deckName: string;
  savedDeckId?: string;
};

export type StartGameSessionResult = {
  status: StartGameSessionStatus;
  savedDeckId: string | null;
};

export type SaveDeckOptions = {
  name: string;
  pairs: WordPair[];
  savedDeckId?: string;
};

export type SavedDeckPersistenceResult = {
  status: SavedDeckPersistenceStatus;
  savedDeckId: string | null;
};

export type WordStatistic = {
  wordPairId: string;
  savedDeckId: string;
  completedGameCount: number;
  bestAccuracy: number;
  bestCorrectAttemptCount: number;
  bestTotalAttemptCount: number;
  lastPlayedAt: number;
};

export type GameSessionContextValue = {
  draft: GameSession;
  session: GameSession | null;
  savedDecks: SavedDeck[];
  isSavedDeckLibraryLoading: boolean;
  savedDeckLibraryError: string | null;
  wordStatistics: WordStatistic[];
  wordMasteries: WordMastery[];
  isWordStatisticsLoading: boolean;
  wordStatisticsError: string | null;
  updateDraft: (update: Partial<GameSession>) => void;
  reuseSavedDeck: (savedDeckId: string) => boolean;
  removeSavedDeck: (savedDeckId: string) => Promise<boolean>;
  startSavedDeckGame: (savedDeckId: string) => boolean;
  startGameSession: (options: StartGameSessionOptions) => Promise<StartGameSessionResult>;
  saveAssessmentStatistics: (options: PersistAssessmentOptions) => Promise<boolean>;
};
