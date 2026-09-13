import { WordPair } from '@/features/GameSession/types';
import { ViewProps } from 'react-native';

export type PreparationWordTileProps = {
  index: number;
  isPrepared: boolean;
  onLayout: NonNullable<ViewProps['onLayout']>;
  wordPair: WordPair;
};
