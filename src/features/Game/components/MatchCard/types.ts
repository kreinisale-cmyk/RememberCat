import { MatchCelebrationAnimation, MatchFeedback } from '../../types';

export enum MatchCardSide {
  Word = 'word',
  Translation = 'translation',
}

export type MatchCardCelebrationMotionOutputRanges = {
  opacity: number[];
  scale: number[];
  translateX: number[];
  translateY: number[];
  rotation: string[];
  rotationY: string[];
};

export type MatchCardProps = {
  label: string;
  side: MatchCardSide;
  completed: boolean;
  celebrationAnimation: MatchCelebrationAnimation | null;
  completionCountdown: number | null;
  selected: boolean;
  feedback: MatchFeedback;
  disabled: boolean;
  onPress: () => void;
};
