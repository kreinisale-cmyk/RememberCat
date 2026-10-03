import { MatchMode } from '@/features/GameSession/types';

export type MatchModeSelectorProps = {
  selectedMatchMode: MatchMode;
  onChange: (matchMode: MatchMode) => void;
};
