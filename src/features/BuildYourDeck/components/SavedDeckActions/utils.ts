import { SELECTED_DECK_HINT, UNSELECTED_DECK_HINT } from './constants';

export function createSavedDeckActionHint(hasSelectedDeck: boolean) {
  if (hasSelectedDeck) {
    return SELECTED_DECK_HINT;
  }

  return UNSELECTED_DECK_HINT;
}
