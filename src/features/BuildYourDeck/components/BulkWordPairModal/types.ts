import { BulkPasteAnalysis } from '../../types';

export type BulkWordPairModalProps = {
  visible: boolean;
  contents: string;
  analysis: BulkPasteAnalysis;
  recentlyAddedPairCount: number;
  wordPairLimit: number;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};
