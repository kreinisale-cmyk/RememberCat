export const INPUT_AUTOMATION_ID_PREFIX = 'custom-';
export const WORD_PAIR_FILE_TYPES = ['text/plain', 'text/csv'];
export const WORD_PAIR_SEPARATOR = '-';
export const BULK_PASTE_OUTER_NOISE_PATTERN = /^[^\p{L}\p{N}\p{M}]+|[^\p{L}\p{N}\p{M}]+$/gu;
export const BULK_PASTE_WORD_CONTENT_PATTERN = /[\p{L}\p{N}]/u;
export const BULK_PASTE_SPACED_DASH_PATTERN = /\s+[-–—]\s+/u;
export const BULK_PASTE_ANY_DASH_PATTERN = /[-–—]/u;
export const BULK_PASTE_LIST_MARKER_PATTERN = /^(?:[-+*•]|\d+[.)])\s+/u;
export const BULK_PASTE_IGNORED_FORMATTING_PATTERN = /^(?:\\|(?:[-*_]\s*){3,})$/u;
export const LONG_WORD_CHARACTER_LIMIT = 10;
export const LONG_WORD_BOUNDARY_PATTERN = /[\s/\\\-–—]+/u;
export const LONG_WORD_COUNTED_CHARACTER_PATTERN = /[\p{L}\p{N}]/u;
export const GAME_ROUTE = '/game';
export const MAX_DECK_NAME_LENGTH = 40;
export const REQUIRED_DECK_NAME_MESSAGE = 'Give this deck a name before starting.';
export const DUPLICATE_PAIR_MESSAGE = 'Every word and translation must be unique in this deck.';
export const DUPLICATE_DECK_MESSAGE = 'A deck with these exact word pairs already exists.';
export const DECK_SAVE_ERROR_MESSAGE = 'This deck could not be saved. Try again.';
export const GAME_SETUP_ROUTE = '/game-setup';
export const WORDS_ROUTE = '/words';
export const SAVED_DECK_LIBRARY_INTRO =
  'Choose a saved list, then start the game or edit its words.';
export const CURRENT_DECK_TITLE = 'Current deck';
export const CURRENT_DECK_HINT = 'Edit the list you want to practice.';
export const LONG_WORD_REVIEW_NOTICE =
  'Some words are longer than 10 characters. Review them before adding.';
