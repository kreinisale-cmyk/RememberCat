export function createPreparationProgressLabel(currentWordNumber: number, totalWordCount: number) {
  return `${currentWordNumber} / ${totalWordCount}`;
}

export function isFinalPreparationWord(currentWordNumber: number, totalWordCount: number) {
  return currentWordNumber === totalWordCount;
}
