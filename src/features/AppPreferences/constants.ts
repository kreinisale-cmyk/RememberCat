import { AppPreferences } from './types';

export const APP_PREFERENCES_STORAGE_KEY = 'remembercat.preferences.v2';
export const LEGACY_APP_PREFERENCES_STORAGE_KEY = 'remembercat.preferences.v1';
export const APP_PREFERENCES_STORAGE_VERSION = 2 as const;
export const APP_PREFERENCES_ERROR_MESSAGE = 'Your feedback setting could not be saved.';
export const MISSING_APP_PREFERENCES_PROVIDER_ERROR =
  'useAppPreferences must be used inside an AppPreferencesProvider.';

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  catReactionsEnabled: true,
  gameCuesEnabled: true,
  hapticsEnabled: true,
};
