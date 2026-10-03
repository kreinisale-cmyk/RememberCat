import { DeckSize, MatchMode } from '@/features/GameSession/types';

export type GameSetupControlsCardProps = {
  selectedDeckSize: DeckSize;
  selectedMatchMode: MatchMode;
  onDeckSizeChange: (deckSize: DeckSize) => void;
  onMatchModeChange: (matchMode: MatchMode) => void;
};
