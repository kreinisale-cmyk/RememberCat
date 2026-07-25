import { createContext } from 'react';

import { GameSessionContextValue } from '../../types';

export const GameSessionContext = createContext<GameSessionContextValue | null>(null);
