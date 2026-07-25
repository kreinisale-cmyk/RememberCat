import { GameSession, WordPair } from './types';

import { DEFAULT_GAME_SESSION } from './constants';

export function createInitialGameSession(): GameSession {
  return { ...DEFAULT_GAME_SESSION, pairs: [] };
}

export function hasCompleteWordPairs(session: GameSession, requiredPairCount: number) {
  return session.pairs.length === requiredPairCount && session.pairs.every(isCompleteWordPair);
}

export function isCompleteWordPair(pair: WordPair) {
  return Boolean(pair.word.trim() && pair.translation.trim());
}
