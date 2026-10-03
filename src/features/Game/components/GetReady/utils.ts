export function clampIntroProgress(progress: number) {
  return Math.min(Math.max(progress, 0), 1);
}
