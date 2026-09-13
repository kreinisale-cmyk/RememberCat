import { WordPair } from '@/features/GameSession/types';

import { MeasuredLayout } from '../../types';

export type PreparationWordGridHandle = {
  measureSlot: (index: number) => Promise<MeasuredLayout | null>;
};

export type PreparationWordGridProps = {
  activeIndex: number;
  preparedWordCount: number;
  wordPairs: WordPair[];
};
