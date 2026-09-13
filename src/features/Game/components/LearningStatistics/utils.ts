export function createLearningStatisticsDescription(missedWordPairCount: number) {
  if (missedWordPairCount === 0) {
    return 'A clean round. Every assessed word is moving in the right direction.';
  } else if (missedWordPairCount === 1) {
    return 'One word needs another look. Review it whenever you are ready.';
  }

  return `${missedWordPairCount} words need another look. Your original result stays unchanged after review.`;
}
