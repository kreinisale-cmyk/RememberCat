import { WordPairConflict, WordPairField } from '../../types';

export function hasFieldConflict(
  conflicts: WordPairConflict[],
  wordPairId: string,
  field: WordPairField,
) {
  return conflicts.some(
    (conflict) => conflict.wordPairId === wordPairId && conflict.fields.includes(field),
  );
}
