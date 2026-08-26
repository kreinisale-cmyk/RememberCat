import {
  GameBoardPair,
  MatchCelebrationAnimation,
  MatchFeedback,
  SelectedBoardPair,
} from '../../types';

export type MatchingBoardProps = {
  gameBoard: GameBoardPair[];
  translationBoardPairs: GameBoardPair[];
  selectedBoardPair: SelectedBoardPair;
  completedWordBoardPairIds: string[];
  completedTranslationBoardPairIds: string[];
  matchFeedback: MatchFeedback;
  matchCelebrationAnimation: MatchCelebrationAnimation | null;
  completionCountdown: number | null;
  kicker: string;
  title: string;
  hint: string;
  progress: number;
  progressLabel: string;
  progressMilestones?: number[];
  onClose: () => void;
  onSelectWordCard: (boardPairId: string) => void;
  onSelectTranslationCard: (boardPairId: string) => void;
};
