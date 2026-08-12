import { GameBoardPair, MatchFeedback, SelectedBoardPair } from '../../types';

export type MatchingBoardProps = {
  gameBoard: GameBoardPair[];
  translationBoardPairs: GameBoardPair[];
  selectedBoardPair: SelectedBoardPair;
  matchFeedback: MatchFeedback;
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
