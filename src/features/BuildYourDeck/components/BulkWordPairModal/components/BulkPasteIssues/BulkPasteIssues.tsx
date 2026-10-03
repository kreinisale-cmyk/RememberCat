import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { RememberCatColors } from '@/constants/theme';

import { createBulkPasteIssueMessage } from '../../utils';
import { BULK_PASTE_ISSUE_COPY } from './constants';
import { styles } from './styles';
import { BulkPasteIssuesProps } from './types';
import {
  createBulkPasteIssueToggleLabel,
  selectBulkPasteIssueResults,
  selectVisibleBulkPasteIssueResults,
  shouldShowBulkPasteIssueToggle,
} from './utils';

export function BulkPasteIssues({ visible, lineResults }: BulkPasteIssuesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const issueResults = selectBulkPasteIssueResults(lineResults);
  const shouldShowToggle = shouldShowBulkPasteIssueToggle(issueResults.length);
  const visibleIssueResults = selectVisibleBulkPasteIssueResults(issueResults, isExpanded);

  useEffect(() => {
    if (!visible || !shouldShowToggle) setIsExpanded(false);
  }, [shouldShowToggle, visible]);

  if (!issueResults.length) return null;

  const issueList = visibleIssueResults.map((lineResult) => (
    <ThemedText key={lineResult.lineNumber} style={styles.issueText}>
      {createBulkPasteIssueMessage(lineResult.lineNumber, lineResult.issue)}
    </ThemedText>
  ));

  return (
    <View style={styles.container}>
      {isExpanded ? (
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator
          style={styles.expandedIssueList}
          contentContainerStyle={styles.expandedIssueListContent}
        >
          {issueList}
        </ScrollView>
      ) : (
        <View style={styles.issueList}>{issueList}</View>
      )}
      {shouldShowToggle ? (
        <Pressable
          accessibilityHint={
            isExpanded
              ? BULK_PASTE_ISSUE_COPY.expandedAccessibilityHint
              : BULK_PASTE_ISSUE_COPY.collapsedAccessibilityHint
          }
          accessibilityLabel={createBulkPasteIssueToggleLabel(issueResults.length, isExpanded)}
          accessibilityRole="button"
          accessibilityState={{ expanded: isExpanded }}
          hitSlop={8}
          onPress={() => setIsExpanded((currentValue) => !currentValue)}
          style={styles.toggle}
        >
          <ThemedText style={styles.toggleText}>
            {createBulkPasteIssueToggleLabel(issueResults.length, isExpanded)}
          </ThemedText>
          {isExpanded ? (
            <ChevronUp color={RememberCatColors.foreground} size={15} strokeWidth={2.4} />
          ) : (
            <ChevronDown color={RememberCatColors.foreground} size={15} strokeWidth={2.4} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
}
