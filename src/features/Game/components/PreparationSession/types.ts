import { WordPair } from '@/features/GameSession/types';

export type PreparationSessionProps = {
  wordPair: WordPair;
  currentWordNumber: number;
  totalWordCount: number;
  onAcknowledge: () => void;
  onClose: () => void;
};
