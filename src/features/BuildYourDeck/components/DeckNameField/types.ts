export type DeckNameFieldProps = {
  name: string;
  errorMessage: string | null;
  maxLength: number;
  onChange: (name: string) => void;
};
