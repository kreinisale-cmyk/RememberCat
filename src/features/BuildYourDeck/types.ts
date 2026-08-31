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

export type WordPairField = 'word' | 'translation';
