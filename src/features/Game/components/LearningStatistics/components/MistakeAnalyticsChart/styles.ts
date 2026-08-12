import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  chartCard: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ecd7ca',
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2e4db',
  },
  chartTitle: {
    color: '#50342f',
    fontWeight: '900',
    fontSize: 15,
    lineHeight: 21,
  },
  chartLegend: {
    color: '#bd675d',
    fontWeight: '800',
    fontSize: 11,
    lineHeight: 17,
  },
  chartScroll: {
    flex: 1,
  },
  chartContent: {
    gap: 15,
    paddingTop: 15,
    paddingBottom: 18,
  },
  barRow: {
    gap: 7,
  },
  wordLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  word: {
    maxWidth: '35%',
    color: '#50342f',
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 20,
  },
  translation: {
    flex: 1,
    color: '#9a776c',
    fontSize: 12,
    lineHeight: 18,
  },
  count: {
    color: '#b65c53',
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 18,
  },
  barTrack: {
    height: 12,
    overflow: 'hidden',
    borderRadius: 6,
    backgroundColor: '#f5e8df',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#d98072',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#d9eadc',
    backgroundColor: '#f2fbf4',
    padding: 28,
  },
  emptyCat: {
    fontSize: 62,
    lineHeight: 76,
  },
  emptyTitle: {
    color: '#347747',
    fontWeight: '900',
    fontSize: 22,
    lineHeight: 29,
    marginTop: 8,
  },
  emptyMessage: {
    color: '#5e8268',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 6,
  },
});
