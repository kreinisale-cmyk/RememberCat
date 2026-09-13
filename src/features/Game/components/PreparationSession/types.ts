import { WordPair } from '@/features/GameSession/types';

export type MeasuredLayout = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type PreparationLandingLayouts = {
  destination: MeasuredLayout;
  source: MeasuredLayout;
};

export enum PreparationAnimationPhase {
  Idle = 'idle',
  Flying = 'flying',
  Landed = 'landed',
}

export type PreparationSessionProps = {
  wordPair: WordPair;
  wordPairs: WordPair[];
  currentWordNumber: number;
  totalWordCount: number;
  onAcknowledge: () => void;
  onClose: () => void;
  onSkip: () => void;
  onWordLanded: () => void;
};
