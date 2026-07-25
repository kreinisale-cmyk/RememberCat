import { WordPair } from '@/features/GameSession/types';
export function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
export function formatClock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
export function makeBoard(pairs: WordPair[], count: number) {
  return pairs.slice(0, count);
}
