const PROGRESS_PERCENTAGE_MULTIPLIER = 100;

export function createProgressWidth(progress: number) {
  const boundedProgress = Math.min(Math.max(progress, 0), 1);

  return `${boundedProgress * PROGRESS_PERCENTAGE_MULTIPLIER}%` as const;
}

export function createMilestonePosition(milestone: number) {
  const boundedMilestone = Math.min(Math.max(milestone, 0), 1);

  return `${boundedMilestone * PROGRESS_PERCENTAGE_MULTIPLIER}%` as const;
}
