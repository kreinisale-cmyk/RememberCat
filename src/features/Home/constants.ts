import { HomeCopy } from './types';
import { createHomeFooterMessage } from './utils';

export const GAME_SETUP_ROUTE = '/game-setup';

export const HOME_COPY: HomeCopy = {
  brandName: 'RememberCat',
  kicker: 'YOUR PLAYFUL WORD TRAINER',
  title: 'Make every word stick.',
  subtitle: 'Build your own deck, match the pairs, and turn practice into progress.',
  button: 'Get Started',
  buttonHint: 'Opens the game setup screen',
  footer: createHomeFooterMessage(),
};
