export type WordListActionsProps = {
  isDeckFull: boolean;
  isDeckReady: boolean;
  importMessage: string;
  onAdd: () => void;
  onImport: () => void;
  onPaste: () => void;
  onStart: () => void;
};
