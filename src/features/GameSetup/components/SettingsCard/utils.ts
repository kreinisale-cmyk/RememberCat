import { SETTINGS_CARD_ACCESSIBILITY_SUFFIX } from './constants';

export function getSettingsCardAccessibilityLabel(title: string) {
  return `${title} ${SETTINGS_CARD_ACCESSIBILITY_SUFFIX}`;
}
