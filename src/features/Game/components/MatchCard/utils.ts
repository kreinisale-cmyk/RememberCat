import { MATCH_OPTION_ACCESSIBILITY_LABEL_PREFIX } from './constants';

export function createMatchOptionAccessibilityLabel(label: string) {
  return `${MATCH_OPTION_ACCESSIBILITY_LABEL_PREFIX} ${label}`;
}
