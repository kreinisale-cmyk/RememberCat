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
};

export type SavedDeck = {
  id: string;
  name: string;
  pairs: WordPair[];
  pairCount: DeckSize;
  updatedAt: number;
};

export type GameSessionContextValue = {
  draft: GameSession;
  session: GameSession | null;
  savedDecks: SavedDeck[];
  isSavedDeckLibraryLoading: boolean;
  savedDeckLibraryError: string | null;
  updateDraft: (update: Partial<GameSession>) => void;
  reuseSavedDeck: (savedDeckId: string) => boolean;
  removeSavedDeck: (savedDeckId: string) => Promise<boolean>;
  startSavedDeckGame: (savedDeckId: string) => boolean;
  startGameSession: (savedDeckId?: string) => Promise<void>;
};
