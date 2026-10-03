import { FocusMode } from '@/features/GameSession/types';

export function getFocusModeDescription(mode: FocusMode) {
  return mode === FocusMode.Timed ? 'One minute for each challenge stage' : 'No challenge clock';
}
