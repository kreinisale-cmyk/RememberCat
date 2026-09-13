import { WordPair } from '@/features/GameSession/types';

import { WordPairConflict, WordPairField } from '../../types';

export type WordPairGridProps = {
  conflicts: WordPairConflict[];
  pairs: WordPair[];
  onEdit: (id: string, field: WordPairField, value: string) => void;
  onRemove: (id: string) => void;
};
