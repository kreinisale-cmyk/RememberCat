import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wordActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  wordActionButton: {
    flex: 1,
    height: 40,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#d77c70',
    backgroundColor: '#fff0e4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  wordActionButtonDisabled: { borderColor: '#d9c0b5', backgroundColor: '#f3e8e2' },
  addPlus: { color: '#c66f61', fontSize: 18, lineHeight: 19 },
  wordActionText: { color: '#9e594f', fontWeight: '800', fontSize: 12 },
  importHint: { color: '#a9897f', textAlign: 'center', fontSize: 11, marginTop: 8 },
  importMessage: { color: '#6d8c67', textAlign: 'center', fontSize: 12, marginTop: 6 },
  startGameButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: '#51342f',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  startGameText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  startGameArrow: { position: 'absolute', right: 19, color: '#f3bd9f', fontSize: 22 },
});
