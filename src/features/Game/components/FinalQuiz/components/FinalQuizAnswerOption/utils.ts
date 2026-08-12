export function createAnswerAccessibilityLabel(
  label: string,
  isCorrect: boolean,
  isIncorrect: boolean,
) {
  if (isCorrect) {
    return `${label}, correct answer`;
  } else if (isIncorrect) {
    return `${label}, incorrect answer`;
  } else {
    return label;
  }
}
