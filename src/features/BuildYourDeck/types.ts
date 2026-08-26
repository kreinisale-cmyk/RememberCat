export enum BuildYourDeckViewMode {
  Library = 'library',
  Editor = 'editor',
}

export enum BuildYourDeckEntryMode {
  Library = 'library',
  Create = 'create',
}

export type BuildYourDeckRouteParams = {
  mode?: string | string[];
};

export type WordPairField = 'word' | 'translation';
