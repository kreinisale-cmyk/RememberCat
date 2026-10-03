import { Platform } from 'react-native';

import { BulkPasteAnalysis, BulkPasteLineIssue, BulkPasteStatus } from '../../types';

export function getModalKeyboardBehavior() {
  return Platform.OS === 'ios' ? 'padding' : 'height';
}

export function createBulkWordPairModalDescription(wordPairLimit: number) {
  return `One pair per line. Use a hyphen, tab, comma, or colon. We'll fill up to ${wordPairLimit} pairs.`;
}

export function createBulkPasteStatusMessage(
  analysis: BulkPasteAnalysis,
  recentlyAddedPairCount: number,
) {
  const addedMessage = recentlyAddedPairCount
    ? `${recentlyAddedPairCount} pair${recentlyAddedPairCount === 1 ? '' : 's'} added. `
    : '';

  if (analysis.status === BulkPasteStatus.Neutral) {
    return `${addedMessage}Paste one word and translation per line.`;
  } else if (analysis.availableSlotCount === 0) {
    return `${addedMessage}Deck full. These lines weren't added.`;
  } else if (analysis.status === BulkPasteStatus.Error) {
    return `${addedMessage}Check your input. Use 'word - translation'.`;
  } else if (analysis.status === BulkPasteStatus.Ready) {
    return `${addedMessage}All ${analysis.readyPairCount} pairs are ready. Let's go!`;
  }

  return `${addedMessage}${analysis.readyPairCount} pairs ready · You're missing ${analysis.missingPairCount}.`;
}

export function createBulkPasteIssueMessage(lineNumber: number, issue: BulkPasteLineIssue) {
  const prefix = `Line ${lineNumber}: `;

  if (issue === BulkPasteLineIssue.MissingWord) {
    return `${prefix}missing word.`;
  } else if (issue === BulkPasteLineIssue.MissingTranslation) {
    return `${prefix}missing translation.`;
  } else if (issue === BulkPasteLineIssue.MissingSeparator) {
    return `${prefix}missing separator.`;
  } else if (issue === BulkPasteLineIssue.ExtraFields) {
    return `${prefix}too many fields or separators.`;
  } else if (issue === BulkPasteLineIssue.DuplicateWord) {
    return `${prefix}duplicate word.`;
  } else if (issue === BulkPasteLineIssue.DuplicateTranslation) {
    return `${prefix}duplicate translation.`;
  }

  return `${prefix}deck limit reached.`;
}

export function createBulkPasteSaveLabel(analysis: BulkPasteAnalysis) {
  const pairCount = analysis.acceptedCandidates.length;
  const pairLabel = `${pairCount} pair${pairCount === 1 ? '' : 's'}`;

  if (analysis.longWordReviewPairs.length) {
    return `Review and add ${pairLabel}`;
  }

  if (analysis.status === BulkPasteStatus.Ready) {
    return `Add ${pairLabel}`;
  }

  return `Add ${pairLabel} valid`;
}
