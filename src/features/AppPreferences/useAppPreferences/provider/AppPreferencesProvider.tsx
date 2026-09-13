import Storage from 'expo-sqlite/kv-store';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  APP_PREFERENCES_ERROR_MESSAGE,
  APP_PREFERENCES_STORAGE_KEY,
  DEFAULT_APP_PREFERENCES,
  LEGACY_APP_PREFERENCES_STORAGE_KEY,
} from '../../constants';
import { AppPreferences } from '../../types';
import {
  parseAppPreferences,
  parseLegacyAppPreferences,
  serializeAppPreferences,
} from '../../utils';
import { AppPreferencesContext } from '../context/AppPreferencesContext';

export function AppPreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(DEFAULT_APP_PREFERENCES);
  const [isPreferencesLoading, setIsPreferencesLoading] = useState(true);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const preferencesRef = useRef(DEFAULT_APP_PREFERENCES);
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());
  const persistenceGenerationRef = useRef(0);
  const isProviderMountedRef = useRef(true);

  useEffect(() => {
    isProviderMountedRef.current = true;

    return () => {
      isProviderMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      try {
        const storedPreferences = await Storage.getItemAsync(APP_PREFERENCES_STORAGE_KEY);
        let loadedPreferences: AppPreferences;
        let shouldPersistLoadedPreferences = false;

        if (storedPreferences) {
          loadedPreferences = parseAppPreferences(storedPreferences);
        } else {
          const legacyStoredPreferences = await Storage.getItemAsync(
            LEGACY_APP_PREFERENCES_STORAGE_KEY,
          );
          loadedPreferences = parseLegacyAppPreferences(legacyStoredPreferences);
          shouldPersistLoadedPreferences = true;
        }

        if (isMounted) {
          preferencesRef.current = loadedPreferences;
          setPreferences(loadedPreferences);
        }

        if (shouldPersistLoadedPreferences) {
          try {
            await Storage.setItemAsync(
              APP_PREFERENCES_STORAGE_KEY,
              serializeAppPreferences(loadedPreferences),
            );
          } catch {
            if (isMounted) {
              setPreferencesError(APP_PREFERENCES_ERROR_MESSAGE);
            }
          }
        }
      } catch {
        if (isMounted) {
          preferencesRef.current = DEFAULT_APP_PREFERENCES;
          setPreferences(DEFAULT_APP_PREFERENCES);
          setPreferencesError(APP_PREFERENCES_ERROR_MESSAGE);
        }
      } finally {
        if (isMounted) {
          setIsPreferencesLoading(false);
        }
      }
    }

    void loadPreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistPreferences = useCallback((nextPreferences: AppPreferences) => {
    preferencesRef.current = nextPreferences;
    setPreferences(nextPreferences);
    const persistenceGeneration = persistenceGenerationRef.current + 1;
    const serializedPreferences = serializeAppPreferences(nextPreferences);

    persistenceGenerationRef.current = persistenceGeneration;
    persistenceQueueRef.current = persistenceQueueRef.current
      .catch(() => undefined)
      .then(() => Storage.setItemAsync(APP_PREFERENCES_STORAGE_KEY, serializedPreferences));

    void persistenceQueueRef.current
      .then(() => {
        if (
          isProviderMountedRef.current &&
          persistenceGeneration === persistenceGenerationRef.current
        ) {
          setPreferencesError(null);
        }
      })
      .catch(() => {
        if (
          isProviderMountedRef.current &&
          persistenceGeneration === persistenceGenerationRef.current
        ) {
          setPreferencesError(APP_PREFERENCES_ERROR_MESSAGE);
        }
      });
  }, []);

  const setCatReactionsEnabled = useCallback(
    (catReactionsEnabled: boolean) => {
      persistPreferences({ ...preferencesRef.current, catReactionsEnabled });
    },
    [persistPreferences],
  );

  const setGameCuesEnabled = useCallback(
    (gameCuesEnabled: boolean) => {
      persistPreferences({ ...preferencesRef.current, gameCuesEnabled });
    },
    [persistPreferences],
  );

  const setHapticsEnabled = useCallback(
    (hapticsEnabled: boolean) => {
      persistPreferences({ ...preferencesRef.current, hapticsEnabled });
    },
    [persistPreferences],
  );

  const value = useMemo(
    () => ({
      preferences,
      isPreferencesLoading,
      preferencesError,
      setCatReactionsEnabled,
      setGameCuesEnabled,
      setHapticsEnabled,
    }),
    [
      isPreferencesLoading,
      preferences,
      preferencesError,
      setCatReactionsEnabled,
      setGameCuesEnabled,
      setHapticsEnabled,
    ],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}
