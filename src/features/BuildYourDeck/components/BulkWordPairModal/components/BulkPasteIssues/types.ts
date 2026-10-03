import { BulkPasteLineIssue, BulkPasteLineResult } from '../../../../types';

export type BulkPasteIssuesProps = {
  visible: boolean;
  lineResults: BulkPasteLineResult[];
};

export type BulkPasteIssueResult = BulkPasteLineResult & {
  issue: BulkPasteLineIssue;
};
