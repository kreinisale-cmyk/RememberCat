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
  correctAttemptCount: number;
  incorrectAttemptCount: number;
};

export type CompletedWordStatistic = {
  wordPairId: string;
  correctAttemptCount: number;
  totalAttemptCount: number;
  accuracy: number;
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
  isWordStatisticsLoading: boolean;
  wordStatisticsError: string | null;
  updateDraft: (update: Partial<GameSession>) => void;
  reuseSavedDeck: (savedDeckId: string) => boolean;
  removeSavedDeck: (savedDeckId: string) => Promise<boolean>;
  startSavedDeckGame: (savedDeckId: string) => boolean;
  startGameSession: (savedDeckId?: string) => Promise<void>;
  saveCompletedGameStatistics: (
    savedDeckId: string,
    completedWordStatistics: CompletedWordStatistic[],
  ) => Promise<boolean>;
};
