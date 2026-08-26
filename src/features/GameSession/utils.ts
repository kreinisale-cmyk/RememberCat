import { GameSession, WordPair } from './types';

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
