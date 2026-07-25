import { useContext } from 'react';

import { MISSING_GAME_SESSION_PROVIDER_ERROR } from '../constants';
import { GameSessionContext } from './context/GameSessionContext';

export function useGameSession() {
  const context = useContext(GameSessionContext);

  if (!context) throw new Error(MISSING_GAME_SESSION_PROVIDER_ERROR);

  return context;
}
