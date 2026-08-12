export type WordPairModalProps = {
  visible: boolean;
  word: string;
  translation: string;
  canSave: boolean;
  onClose: () => void;
  onWordChange: (value: string) => void;
  onTranslationChange: (value: string) => void;
  onSave: () => void;
};
