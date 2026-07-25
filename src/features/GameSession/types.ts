export enum FocusMode {
  Timed = 'timed',
  Free = 'free',
}

export enum MatchMode {
  Easy = 'easy',
  Hard = 'hard',
}

export type WordPair = {
  id: string;
  word: string;
  translation: string;
};

export type GameSession = {
  pairs: WordPair[];
  focusMode: FocusMode;
  matchMode: MatchMode;
};

export type GameSessionContextValue = {
  draft: GameSession;
  session: GameSession | null;
  updateDraft: (update: Partial<GameSession>) => void;
  startGameSession: () => void;
};
