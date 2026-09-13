export type WordPairModalProps = {
  visible: boolean;
  word: string;
  translation: string;
  canSave: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onWordChange: (value: string) => void;
  onTranslationChange: (value: string) => void;
  onSave: () => void;
};
