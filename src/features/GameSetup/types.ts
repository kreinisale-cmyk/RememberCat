import { FocusMode, MatchMode } from '@/features/GameSession/types';

export type ModeToggleProps<T> = {
  first: T;
  second: T;
  selected: T;
  onChange: (value: T) => void;
};

export type SetupMode = FocusMode | MatchMode;
