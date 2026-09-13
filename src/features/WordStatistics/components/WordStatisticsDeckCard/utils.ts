import { MasteryLevel } from '@/features/GameSession/types';

export function createMasteryLabel(masteryLevel: MasteryLevel) {
  return masteryLevel.charAt(0).toLocaleUpperCase() + masteryLevel.slice(1);
}
