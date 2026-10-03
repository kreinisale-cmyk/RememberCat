import { BulkPasteLineResult } from '../../../../types';
import { BULK_PASTE_ISSUE_COPY, BULK_PASTE_ISSUE_PREVIEW_LIMIT } from './constants';
import { BulkPasteIssueResult } from './types';

export function selectBulkPasteIssueResults(lineResults: BulkPasteLineResult[]) {
  return lineResults.filter(
    (lineResult): lineResult is BulkPasteIssueResult => lineResult.issue !== null,
  );
}

export function selectVisibleBulkPasteIssueResults(
  issueResults: BulkPasteIssueResult[],
  isExpanded: boolean,
) {
  return isExpanded ? issueResults : issueResults.slice(0, BULK_PASTE_ISSUE_PREVIEW_LIMIT);
}

export function shouldShowBulkPasteIssueToggle(issueCount: number) {
  return issueCount > BULK_PASTE_ISSUE_PREVIEW_LIMIT;
}

export function createBulkPasteIssueToggleLabel(issueCount: number, isExpanded: boolean) {
  if (isExpanded) return BULK_PASTE_ISSUE_COPY.showFewer;

  return `${BULK_PASTE_ISSUE_COPY.showAll} ${issueCount} ${BULK_PASTE_ISSUE_COPY.issues}`;
}
