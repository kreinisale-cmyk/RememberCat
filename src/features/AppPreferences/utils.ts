import { APP_PREFERENCES_STORAGE_VERSION, DEFAULT_APP_PREFERENCES } from './constants';
import { AppPreferences, StoredAppPreferencesV2 } from './types';

export function parseAppPreferences(value: string | null): AppPreferences {
  if (!value) {
    return DEFAULT_APP_PREFERENCES;
  }

  try {
    const parsedValue = JSON.parse(value) as Partial<StoredAppPreferencesV2>;

    if (
      parsedValue.version !== APP_PREFERENCES_STORAGE_VERSION ||
      typeof parsedValue.catReactionsEnabled !== 'boolean' ||
      typeof parsedValue.gameCuesEnabled !== 'boolean' ||
      typeof parsedValue.hapticsEnabled !== 'boolean'
    ) {
      return DEFAULT_APP_PREFERENCES;
    }

    return {
      catReactionsEnabled: parsedValue.catReactionsEnabled,
      gameCuesEnabled: parsedValue.gameCuesEnabled,
      hapticsEnabled: parsedValue.hapticsEnabled,
    };
  } catch {
    return DEFAULT_APP_PREFERENCES;
  }
}

export function parseLegacyAppPreferences(value: string | null): AppPreferences {
  if (!value) {
    return DEFAULT_APP_PREFERENCES;
  }

  try {
    const parsedValue = JSON.parse(value) as {
      soundEnabled?: unknown;
      hapticsEnabled?: unknown;
    };

    if (
      typeof parsedValue.soundEnabled !== 'boolean' ||
      typeof parsedValue.hapticsEnabled !== 'boolean'
    ) {
      return DEFAULT_APP_PREFERENCES;
    }

    return {
      catReactionsEnabled: parsedValue.soundEnabled,
      gameCuesEnabled: parsedValue.soundEnabled,
      hapticsEnabled: parsedValue.hapticsEnabled,
    };
  } catch {
    return DEFAULT_APP_PREFERENCES;
  }
}

export function serializeAppPreferences(preferences: AppPreferences) {
  const storedPreferences: StoredAppPreferencesV2 = {
    version: APP_PREFERENCES_STORAGE_VERSION,
    ...preferences,
  };

  return JSON.stringify(storedPreferences);
}
