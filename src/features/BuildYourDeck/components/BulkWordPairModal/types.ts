export type BulkWordPairModalProps = {
  visible: boolean;
  contents: string;
  wordPairLimit: number;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};
