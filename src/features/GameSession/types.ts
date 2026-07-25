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
