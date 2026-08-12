export function createLearningStatisticsDescription(practicePairCount: number) {
  if (practicePairCount === 1) {
    return 'See which words caused mistakes and how often they appeared.';
  }

  return `You practiced ${practicePairCount} tricky words. The chart shows where the mistakes happened.`;
}
