export const WORDS_COPY = {
  kicker: 'YOUR WORDS',
  title: 'Saved word lists',
  intro: 'Browse every saved word, choose a list to play, or open it for editing.',
  category: 'Practice size',
  loading: 'Loading your saved words...',
} as const;
export const EMPTY_WORDS_COPY = {
  icon: '🐱',
  title: 'No saved words yet',
  message: 'Create a word list in this practice-size category to see it here.',
} as const;
export const CREATE_LIST_LABEL = '+ Create new word list';
export const START_GAME_LABEL = 'Start game';
export const DELETE_CONFIRM_TITLE = 'Delete this word list?';
export const DELETE_CONFIRM_MESSAGE = 'Its saved words and statistics will be removed.';
export const DELETE_CONFIRM_CANCEL_LABEL = 'Cancel';
export const DELETE_CONFIRM_LABEL = 'Delete';
export const WORD_EDITOR_ROUTE = '/words/editor';
export const GAME_ROUTE = '/game';
export const WORDS_HEADER_ICON_SIZE = 22;
export const WORDS_BACK_ICON_SIZE = 20;
export const WORDS_ICONS = {
  back: { ios: 'arrow.left', android: 'arrow_back', web: 'arrow_back' },
  cat: { ios: 'cat.fill', android: 'pets', web: 'pets' },
} as const;
