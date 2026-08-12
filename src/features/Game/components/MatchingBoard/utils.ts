import { MatchFeedback } from '../../types';
export function getSelectedCardFeedback(
  matchFeedback: MatchFeedback,
  boardPairId: string,
  selectedBoardPairId: string | null,
) {
  if (boardPairId !== selectedBoardPairId) {
    return MatchFeedback.None;
  }

  return matchFeedback;
}
