import { StyleSheet } from 'react-native';

import { RememberCatColors, RememberCatFonts } from '@/constants/theme';

import { BULK_PASTE_ISSUE_LIST_MAX_HEIGHT } from './constants';

export const styles = StyleSheet.create({
  container: { marginTop: 7, paddingLeft: 28 },
  issueList: { gap: 3 },
  expandedIssueList: { maxHeight: BULK_PASTE_ISSUE_LIST_MAX_HEIGHT },
  expandedIssueListContent: { gap: 3, paddingRight: 4 },
  issueText: {
    color: RememberCatColors.mutedForeground,
    fontFamily: RememberCatFonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  toggle: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 7,
  },
  toggleText: {
    color: RememberCatColors.foreground,
    fontFamily: RememberCatFonts.bodyBold,
    fontSize: 12,
    lineHeight: 18,
  },
});
