import { View } from 'react-native';

import { MeasuredLayout } from './types';

export function createPreparationProgressLabel(currentWordNumber: number, totalWordCount: number) {
  return `${currentWordNumber} / ${totalWordCount}`;
}

export function isFinalPreparationWord(currentWordNumber: number, totalWordCount: number) {
  return currentWordNumber === totalWordCount;
}

export function getPreparedWordCount(currentWordNumber: number, isCurrentWordLanded: boolean) {
  const previouslyPreparedWordCount = Math.max(0, currentWordNumber - 1);

  if (isCurrentWordLanded) {
    return previouslyPreparedWordCount + 1;
  }

  return previouslyPreparedWordCount;
}

export function measureViewInWindow(view: View | null) {
  return new Promise<MeasuredLayout | null>((resolve) => {
    if (!view) {
      resolve(null);
      return;
    }

    view.measureInWindow((x, y, width, height) => {
      if (width <= 0 || height <= 0) {
        resolve(null);
        return;
      }

      resolve({ x, y, width, height });
    });
  });
}

export function convertWindowLayoutToRoot(
  layout: MeasuredLayout,
  rootLayout: MeasuredLayout,
): MeasuredLayout {
  return {
    ...layout,
    x: layout.x - rootLayout.x,
    y: layout.y - rootLayout.y,
  };
}
