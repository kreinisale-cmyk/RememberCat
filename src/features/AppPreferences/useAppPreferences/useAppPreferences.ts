import { useContext } from 'react';

import { MISSING_APP_PREFERENCES_PROVIDER_ERROR } from '../constants';
import { AppPreferencesContext } from './context/AppPreferencesContext';

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error(MISSING_APP_PREFERENCES_PROVIDER_ERROR);
  }

  return context;
}
