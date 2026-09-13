import { createContext } from 'react';

import { AppPreferencesContextValue } from '../../types';

export const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(null);
