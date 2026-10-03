import { FocusMode, MatchMode } from '@/features/GameSession/types';

export type ModeToggleProps<T extends FocusMode | MatchMode> = {
  first: T;
  second: T;
  selected: T;
  onChange: (value: T) => void;
};
