import { MatchCelebrationAnimation } from './types';

export const BOARD_SIZE = 6;
export const PRACTICE_BOARD_SIZE = 4;
export const DIFFICULT_WORD_PAIR_COUNT = 7;
export const FINAL_QUIZ_CHOICE_COUNT = 6;
export const EASY_REINFORCEMENT_CHOICE_COUNT = 4;
export const EASY_REINFORCEMENT_REPETITION_GOAL = 5;
export const EASY_REINFORCEMENT_SKIP_LOCK_DURATION_MS = 300;
export const CHALLENGE_STAGE_MATCH_GOAL = 20;
export const STANDARD_CHALLENGE_STAGE_SECONDS = 60;
export const TIMED_ROUND_FIRST_BOARD_SIZE = 4;
export const TIMED_ROUND_SECOND_BOARD_SIZE = 5;
export const TIMED_ROUND_THIRD_BOARD_SIZE = 6;
export const MILLISECONDS_PER_SECOND = 1000;
export const MATCH_FEEDBACK_DURATION_MS = 620;
export const INCORRECT_FEEDBACK_DURATION_MS = 520;
export const FINAL_QUIZ_CORRECT_FEEDBACK_DURATION_MS = 1200;
export const FINAL_QUIZ_MISS_FEEDBACK_DURATION_MS = 720;
export const EASY_REINFORCEMENT_CORRECT_FEEDBACK_DURATION_MS = 620;
export const EASY_REINFORCEMENT_INCORRECT_FEEDBACK_DURATION_MS = 520;
export const LEARNED_WORD_CELEBRATION_DURATION_MS = 1800;
export const GAME_SETUP_ROUTE = '/game-setup';
export const MAIN_BOARD_PAIR_ID_PREFIX = 'main';
export const PRACTICE_BOARD_PAIR_ID_PREFIX = 'practice';
export const MAIN_ROUND_PRACTICE_KICKER = 'NO TIME LIMIT';
export const MAIN_ROUND_TIMED_KICKER_PREFIX = 'TIME LEFT';
export const MAIN_ROUND_TITLE = 'Make the matches';
export const MAIN_ROUND_EASY_HINT = 'Clear 20 matches. Only the translations shuffle.';
export const MAIN_ROUND_HARD_HINT = 'Clear 20 matches. Both columns shuffle after every match.';
export const PRACTICE_ROUND_KICKER = 'TRICKY WORDS';
export const PRACTICE_ROUND_TITLE = 'Make these words stick';
export const PRACTICE_ROUND_EASY_HINT = 'Match every pair once. Only translations shuffle.';
export const PRACTICE_ROUND_HARD_HINT = 'Match every pair once. Both columns shuffle.';
export const MATCH_CELEBRATION_ANIMATIONS = [
  MatchCelebrationAnimation.Burst,
  MatchCelebrationAnimation.Shatter,
  MatchCelebrationAnimation.Portal,
];
