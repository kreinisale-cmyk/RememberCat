export type GameFeedbackSettingsProps = {
  catReactionsEnabled: boolean;
  gameCuesEnabled: boolean;
  hapticsEnabled: boolean;
  isDisabled: boolean;
  errorMessage: string | null;
  onCatReactionsEnabledChange: (enabled: boolean) => void;
  onGameCuesEnabledChange: (enabled: boolean) => void;
  onHapticsEnabledChange: (enabled: boolean) => void;
};
