import { GameSession, WordPair } from './types';

export function hasCompleteWordPairs(session: GameSession, requiredPairCount: number) {
  return session.pairs.length === requiredPairCount && session.pairs.every(isCompleteWordPair);
}

export function isCompleteWordPair(pair: WordPair) {
  return Boolean(pair.word.trim() && pair.translation.trim());
}
