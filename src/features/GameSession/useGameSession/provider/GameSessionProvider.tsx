import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { GameSession } from '../../types';
import { createInitialGameSession } from '../../utils';
import { GameSessionContext } from '../context/GameSessionContext';

export function GameSessionProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState(createInitialGameSession);
  const [session, setSession] = useState<GameSession | null>(null);

  const updateDraft = useCallback((update: Partial<GameSession>) => {
    setDraft((currentDraft) => ({ ...currentDraft, ...update }));
  }, []);

  const startGameSession = useCallback(() => {
    setSession({ ...draft, pairs: draft.pairs.map((pair) => ({ ...pair })) });
  }, [draft]);

  const value = useMemo(
    () => ({ draft, session, updateDraft, startGameSession }),
    [draft, session, startGameSession, updateDraft],
  );

  return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}
