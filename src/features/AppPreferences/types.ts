export type AppPreferences = {
  catReactionsEnabled: boolean;
  gameCuesEnabled: boolean;
  hapticsEnabled: boolean;
};

export type StoredAppPreferencesV2 = AppPreferences & {
  version: 2;
};

export type AppPreferencesContextValue = {
  preferences: AppPreferences;
  isPreferencesLoading: boolean;
  preferencesError: string | null;
  setCatReactionsEnabled: (enabled: boolean) => void;
  setGameCuesEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
};
