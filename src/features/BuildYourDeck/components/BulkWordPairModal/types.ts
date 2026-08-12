export type BulkWordPairModalProps = {
  visible: boolean;
  contents: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};
