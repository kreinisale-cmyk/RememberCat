export enum BuildYourDeckViewMode {
  Library = 'library',
  Editor = 'editor',
}

export enum BuildYourDeckEntryMode {
  Library = 'library',
  Create = 'create',
  Edit = 'edit',
}

export enum BuildYourDeckEntryOrigin {
  GameSetup = 'game-setup',
  Words = 'words',
}

export type BuildYourDeckRouteParams = {
  mode?: string | string[];
  origin?: string | string[];
  savedDeckId?: string | string[];
  size?: string | string[];
};

export enum WordPairField {
  Word = 'word',
  Translation = 'translation',
}

export enum WordPairAdditionSource {
  Bulk = 'bulk',
  Import = 'import',
}

export type WordPairConflict = {
  wordPairId: string;
  fields: WordPairField[];
};

export enum BulkPasteStatus {
  Neutral = 'neutral',
  Error = 'error',
  Warning = 'warning',
  Ready = 'ready',
}

export enum BulkPasteLineIssue {
  MissingWord = 'missing-word',
  MissingTranslation = 'missing-translation',
  MissingSeparator = 'missing-separator',
  ExtraFields = 'extra-fields',
  DuplicateWord = 'duplicate-word',
  DuplicateTranslation = 'duplicate-translation',
  DeckLimit = 'deck-limit',
}

export enum LongWordReviewMode {
  Editing = 'editing',
  Reviewing = 'reviewing',
}

export type LongWordReviewFinding = {
  field: WordPairField;
  longWord: string;
  characterCount: number;
};

export type LongWordReviewPair = {
  word: string;
  translation: string;
  lineNumber?: number;
  findings: LongWordReviewFinding[];
};

export type BulkPasteCandidate = {
  lineNumber: number;
  originalLine: string;
  word: string;
  translation: string;
};

export type BulkPasteLineResult = BulkPasteCandidate & {
  issue: BulkPasteLineIssue | null;
};

export type BulkPasteAnalysis = {
  status: BulkPasteStatus;
  lineResults: BulkPasteLineResult[];
  acceptedCandidates: BulkPasteCandidate[];
  remainingContents: string;
  readyPairCount: number;
  missingPairCount: number;
  availableSlotCount: number;
  longWordReviewPairs: LongWordReviewPair[];
};

export type BulkWordPairAdditionResult = {
  addedPairCount: number;
  remainingContents: string;
};
