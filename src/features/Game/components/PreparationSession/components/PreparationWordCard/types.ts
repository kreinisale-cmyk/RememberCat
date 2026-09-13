import { WordPair } from '@/features/GameSession/types';

export type PreparationWordCardProps = {
  isDisabled: boolean;
  isFinalWord: boolean;
  onAcknowledge: () => void;
  wordPair: WordPair;
};
