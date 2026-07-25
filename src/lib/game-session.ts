import { DEFAULT_GAME_SESSION } from '@/features/GameSession/constants';
import { GameSession, WordPair } from '@/features/GameSession/types';

export { GameSession, WordPair } from '@/features/GameSession/types';

let session: GameSession | null = null;
let setupDraft: GameSession = DEFAULT_GAME_SESSION;

export function setGameSession(nextSession: GameSession) {
  session = nextSession;
}

export function getGameSession() {
  return session;
}

export function getSetupDraft() {
  return setupDraft;
}

export function updateSetupDraft(update: Partial<GameSession>) {
  setupDraft = { ...setupDraft, ...update };
}
