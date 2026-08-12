import { MatchFeedback } from '../../types';

export type MatchCardProps = {
  label: string;
  selected: boolean;
  feedback: MatchFeedback;
  disabled: boolean;
  onPress: () => void;
};
