import { DeckSize, SavedDeck, WordPair } from '@/features/GameSession/types';

import {
  BULK_PASTE_ANY_DASH_PATTERN,
  BULK_PASTE_IGNORED_FORMATTING_PATTERN,
  BULK_PASTE_LIST_MARKER_PATTERN,
  BULK_PASTE_OUTER_NOISE_PATTERN,
  BULK_PASTE_SPACED_DASH_PATTERN,
  BULK_PASTE_WORD_CONTENT_PATTERN,
  INPUT_AUTOMATION_ID_PREFIX,
  LONG_WORD_BOUNDARY_PATTERN,
  LONG_WORD_CHARACTER_LIMIT,
  LONG_WORD_COUNTED_CHARACTER_PATTERN,
  WORD_PAIR_SEPARATOR,
} from './constants';
import {
  BuildYourDeckEntryMode,
  BuildYourDeckEntryOrigin,
  BulkPasteAnalysis,
  BulkPasteCandidate,
  BulkPasteLineIssue,
  BulkPasteLineResult,
  BulkPasteStatus,
  LongWordReviewFinding,
  LongWordReviewPair,
  WordPairConflict,
  WordPairAdditionSource,
  WordPairField,
} from './types';

type ParsedBulkPasteLine =
  | { candidate: BulkPasteCandidate; issue: null }
  | { candidate: BulkPasteCandidate; issue: BulkPasteLineIssue };

const BULK_PASTE_SEPARATORS = [
  { pattern: /\t/, splitPattern: /\t/ },
  { pattern: BULK_PASTE_SPACED_DASH_PATTERN, splitPattern: BULK_PASTE_SPACED_DASH_PATTERN },
  { pattern: /:/, splitPattern: /:/ },
  { pattern: /,/, splitPattern: /,/ },
  { pattern: BULK_PASTE_ANY_DASH_PATTERN, splitPattern: BULK_PASTE_ANY_DASH_PATTERN },
] as const;

export function createWordPair(word: string, translation: string): WordPair {
  return {
    id: `${INPUT_AUTOMATION_ID_PREFIX}${Date.now()}-${Math.random()}`,
    word: word.trim(),
    translation: translation.trim(),
  };
}

export function parseWordPairFile(contents: string): WordPair[] {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const separatorIndex = line.indexOf(WORD_PAIR_SEPARATOR);

      if (separatorIndex < 1) return [];

      const word = line.slice(0, separatorIndex).trim();
      const translation = line.slice(separatorIndex + WORD_PAIR_SEPARATOR.length).trim();

      return word && translation ? [createWordPair(word, translation)] : [];
    });
}

export function cleanBulkPasteField(value: string) {
  const cleanedValue = value.trim().replace(BULK_PASTE_OUTER_NOISE_PATTERN, '');

  return BULK_PASTE_WORD_CONTENT_PATTERN.test(cleanedValue) ? cleanedValue : '';
}

export function countLongWordCharacters(value: string) {
  return [...value.normalize('NFD')].filter((character) =>
    LONG_WORD_COUNTED_CHARACTER_PATTERN.test(character),
  ).length;
}

export function findLongWords(value: string, field: WordPairField): LongWordReviewFinding[] {
  return value
    .split(LONG_WORD_BOUNDARY_PATTERN)
    .map((word) => cleanBulkPasteField(word))
    .filter(Boolean)
    .flatMap((longWord) => {
      const characterCount = countLongWordCharacters(longWord);

      return characterCount > LONG_WORD_CHARACTER_LIMIT
        ? [{ field, longWord, characterCount }]
        : [];
    });
}

export function createLongWordReviewPair(
  word: string,
  translation: string,
  lineNumber?: number,
): LongWordReviewPair | null {
  const findings = [
    ...findLongWords(word, WordPairField.Word),
    ...findLongWords(translation, WordPairField.Translation),
  ];

  return findings.length ? { word, translation, lineNumber, findings } : null;
}

export function createLongWordReviewPairs(
  candidates: Pick<BulkPasteCandidate, 'word' | 'translation' | 'lineNumber'>[],
) {
  return candidates.flatMap((candidate) => {
    const reviewPair = createLongWordReviewPair(
      candidate.word,
      candidate.translation,
      candidate.lineNumber,
    );

    return reviewPair ? [reviewPair] : [];
  });
}

export function createLongWordReviewKey(reviewPairs: LongWordReviewPair[]) {
  return reviewPairs
    .map((reviewPair) =>
      [reviewPair.lineNumber ?? '', reviewPair.word, reviewPair.translation]
        .map((value) => String(value).normalize('NFKC'))
        .join('\u0001'),
    )
    .join('\u0002');
}

export function removeBulkPasteListMarker(line: string) {
  const markerMatch = line.match(BULK_PASTE_LIST_MARKER_PATTERN);

  if (!markerMatch) return line;

  const withoutMarker = line.slice(markerMatch[0].length);
  const hasRemainingSeparator = BULK_PASTE_SEPARATORS.some(({ pattern }) =>
    pattern.test(withoutMarker),
  );

  return hasRemainingSeparator ? withoutMarker : line;
}

export function isIgnorableBulkPasteFormattingLine(line: string) {
  return BULK_PASTE_IGNORED_FORMATTING_PATTERN.test(line.trim());
}

function parseBulkPasteLine(originalLine: string, lineNumber: number): ParsedBulkPasteLine {
  const trimmedLine = removeBulkPasteListMarker(originalLine.trim());
  const separator = BULK_PASTE_SEPARATORS.find(({ pattern }) => pattern.test(trimmedLine));
  const emptyCandidate = { lineNumber, originalLine, word: '', translation: '' };

  if (!separator) {
    return { candidate: emptyCandidate, issue: BulkPasteLineIssue.MissingSeparator };
  }

  const fields = trimmedLine.split(separator.splitPattern).map(cleanBulkPasteField);

  if (fields.length !== 2) {
    return { candidate: emptyCandidate, issue: BulkPasteLineIssue.ExtraFields };
  }

  const [word, translation] = fields;
  const candidate = { lineNumber, originalLine, word, translation };

  if (!word) {
    return { candidate, issue: BulkPasteLineIssue.MissingWord };
  } else if (!translation) {
    return { candidate, issue: BulkPasteLineIssue.MissingTranslation };
  }

  return { candidate, issue: null };
}

function shouldIgnoreBulkPasteIntroductionLine(
  trimmedLine: string,
  parsedLine: ParsedBulkPasteLine,
) {
  if (parsedLine.issue === BulkPasteLineIssue.MissingSeparator) return true;

  const hasDashOrTab = BULK_PASTE_ANY_DASH_PATTERN.test(trimmedLine) || trimmedLine.includes('\t');

  if (trimmedLine.endsWith(':') && !hasDashOrTab) return true;

  return parsedLine.issue === BulkPasteLineIssue.ExtraFields && !hasDashOrTab;
}

export function analyzeBulkWordPairPaste(
  contents: string,
  existingPairs: WordPair[],
  wordPairLimit: number,
): BulkPasteAnalysis {
  const availableSlotCount = Math.max(0, wordPairLimit - existingPairs.length);
  const acceptedCandidates: BulkPasteCandidate[] = [];
  const lineResults: BulkPasteLineResult[] = [];
  let hasReadablePair = false;

  const sourceLines = contents.split(/\r?\n/);
  const firstFormattedListItemIndex = sourceLines.findIndex((originalLine) => {
    const trimmedLine = originalLine.trim();

    return removeBulkPasteListMarker(trimmedLine) !== trimmedLine;
  });

  sourceLines.forEach((originalLine, lineIndex) => {
    const trimmedLine = originalLine.trim();

    if (!trimmedLine || isIgnorableBulkPasteFormattingLine(trimmedLine)) return;

    const parsedLine = parseBulkPasteLine(originalLine, lineIndex + 1);

    if (
      firstFormattedListItemIndex >= 0 &&
      lineIndex < firstFormattedListItemIndex &&
      shouldIgnoreBulkPasteIntroductionLine(trimmedLine, parsedLine)
    ) {
      return;
    }

    let issue = parsedLine.issue;

    if (!issue) {
      hasReadablePair = true;
      const normalizedWord = normalizeComparableWordPairValue(parsedLine.candidate.word);
      const normalizedTranslation = normalizeComparableWordPairValue(
        parsedLine.candidate.translation,
      );
      const comparisonPairs = [
        ...existingPairs,
        ...acceptedCandidates.map((candidate) => ({
          id: '',
          word: candidate.word,
          translation: candidate.translation,
        })),
      ];
      const hasDuplicateWord = comparisonPairs.some(
        (pair) => normalizeComparableWordPairValue(pair.word) === normalizedWord,
      );
      const hasDuplicateTranslation = comparisonPairs.some(
        (pair) => normalizeComparableWordPairValue(pair.translation) === normalizedTranslation,
      );

      if (hasDuplicateWord) {
        issue = BulkPasteLineIssue.DuplicateWord;
      } else if (hasDuplicateTranslation) {
        issue = BulkPasteLineIssue.DuplicateTranslation;
      } else if (acceptedCandidates.length >= availableSlotCount) {
        issue = BulkPasteLineIssue.DeckLimit;
      } else {
        acceptedCandidates.push(parsedLine.candidate);
      }
    }

    lineResults.push({ ...parsedLine.candidate, issue });
  });

  const readyPairCount = existingPairs.length + acceptedCandidates.length;
  const missingPairCount = Math.max(0, wordPairLimit - readyPairCount);
  const hasIssues = lineResults.some((lineResult) => lineResult.issue !== null);
  let status = BulkPasteStatus.Warning;

  if (lineResults.length === 0) {
    status = BulkPasteStatus.Neutral;
  } else if (availableSlotCount === 0) {
    status = BulkPasteStatus.Warning;
  } else if (!hasReadablePair) {
    status = BulkPasteStatus.Error;
  } else if (!hasIssues && missingPairCount === 0) {
    status = BulkPasteStatus.Ready;
  }

  return {
    status,
    lineResults,
    acceptedCandidates,
    remainingContents: lineResults
      .filter((lineResult) => lineResult.issue !== null)
      .map((lineResult) => lineResult.originalLine)
      .join('\n'),
    readyPairCount,
    missingPairCount,
    availableSlotCount,
    longWordReviewPairs: createLongWordReviewPairs(acceptedCandidates),
  };
}

export function createBulkWordPairAdditionMessage(
  addedPairCount: number,
  remainingLineCount: number,
) {
  let message = `Added ${addedPairCount} word pair${addedPairCount === 1 ? '' : 's'}.`;

  if (remainingLineCount > 0) {
    message += ` Kept ${remainingLineCount} line${remainingLineCount === 1 ? '' : 's'} to fix.`;
  }

  return message;
}

export function normalizeComparableWordPairValue(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function findWordPairConflicts(pairs: WordPair[]): WordPairConflict[] {
  const wordIdsByValue = new Map<string, string[]>();
  const translationIdsByValue = new Map<string, string[]>();

  for (const pair of pairs) {
    const word = normalizeComparableWordPairValue(pair.word);
    const translation = normalizeComparableWordPairValue(pair.translation);

    if (word) {
      wordIdsByValue.set(word, [...(wordIdsByValue.get(word) ?? []), pair.id]);
    }

    if (translation) {
      translationIdsByValue.set(translation, [
        ...(translationIdsByValue.get(translation) ?? []),
        pair.id,
      ]);
    }
  }

  const fieldsByPairId = new Map<string, Set<WordPairField>>();

  for (const duplicateWordPairIds of wordIdsByValue.values()) {
    if (duplicateWordPairIds.length > 1) {
      duplicateWordPairIds.forEach((wordPairId) => {
        const fields = fieldsByPairId.get(wordPairId) ?? new Set<WordPairField>();
        fields.add(WordPairField.Word);
        fieldsByPairId.set(wordPairId, fields);
      });
    }
  }

  for (const duplicateTranslationPairIds of translationIdsByValue.values()) {
    if (duplicateTranslationPairIds.length > 1) {
      duplicateTranslationPairIds.forEach((wordPairId) => {
        const fields = fieldsByPairId.get(wordPairId) ?? new Set<WordPairField>();
        fields.add(WordPairField.Translation);
        fieldsByPairId.set(wordPairId, fields);
      });
    }
  }

  return [...fieldsByPairId.entries()].map(([wordPairId, fields]) => ({
    wordPairId,
    fields: [...fields],
  }));
}

export function findCandidateWordPairConflict(pairs: WordPair[], candidate: WordPair) {
  const candidateWord = normalizeComparableWordPairValue(candidate.word);
  const candidateTranslation = normalizeComparableWordPairValue(candidate.translation);

  return pairs.some((pair) => {
    return (
      normalizeComparableWordPairValue(pair.word) === candidateWord ||
      normalizeComparableWordPairValue(pair.translation) === candidateTranslation
    );
  });
}

export function selectUniqueWordPairs(
  existingPairs: WordPair[],
  incomingPairs: WordPair[],
  availableSlots: number,
) {
  const acceptedPairs: WordPair[] = [];
  let skippedPairCount = 0;

  for (const incomingPair of incomingPairs) {
    if (acceptedPairs.length >= availableSlots) {
      break;
    }

    if (findCandidateWordPairConflict([...existingPairs, ...acceptedPairs], incomingPair)) {
      skippedPairCount += 1;
    } else {
      acceptedPairs.push(incomingPair);
    }
  }

  return { acceptedPairs, skippedPairCount };
}

export function createWordPairAdditionMessage(
  source: WordPairAdditionSource,
  addedPairCount: number,
  skippedPairCount: number,
) {
  if (addedPairCount === 0 && skippedPairCount > 0) {
    return `Skipped ${skippedPairCount} duplicate pair${skippedPairCount === 1 ? '' : 's'}.`;
  } else if (addedPairCount === 0) {
    return 'No valid word - translation pairs found.';
  }

  const action = source === WordPairAdditionSource.Import ? 'Imported' : 'Added';
  let message = `${action} ${addedPairCount} word pair${addedPairCount === 1 ? '' : 's'}`;

  if (skippedPairCount > 0) {
    message += ` and skipped ${skippedPairCount} duplicate${skippedPairCount === 1 ? '' : 's'}`;
  }

  return `${message}.`;
}
export function updateWordPair(pairs: WordPair[], id: string, field: WordPairField, value: string) {
  return pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair));
}
export function removeWordPair(pairs: WordPair[], id: string) {
  return pairs.filter((pair) => pair.id !== id);
}

export function hasCompleteWordPair({ word, translation }: WordPair) {
  return Boolean(word.trim() && translation.trim());
}

export function filterSavedDecksByDeckSize(savedDecks: SavedDeck[], deckSize: DeckSize) {
  return savedDecks
    .filter((savedDeck) => savedDeck.pairCount === deckSize)
    .sort(
      (firstSavedDeck, secondSavedDeck) => secondSavedDeck.updatedAt - firstSavedDeck.updatedAt,
    );
}

export function parseBuildYourDeckEntryMode(mode: string | string[] | undefined) {
  const resolvedMode = Array.isArray(mode) ? mode[0] : mode;

  if (
    resolvedMode === BuildYourDeckEntryMode.Create ||
    resolvedMode === BuildYourDeckEntryMode.Edit
  ) {
    return resolvedMode;
  }

  return BuildYourDeckEntryMode.Library;
}

export function parseBuildYourDeckEntryOrigin(origin: string | string[] | undefined) {
  const resolvedOrigin = Array.isArray(origin) ? origin[0] : origin;

  if (resolvedOrigin === BuildYourDeckEntryOrigin.GameSetup) {
    return BuildYourDeckEntryOrigin.GameSetup;
  }

  return BuildYourDeckEntryOrigin.Words;
}

export function parseSingleRouteParameter(parameter: string | string[] | undefined) {
  return Array.isArray(parameter) ? parameter[0] : parameter;
}
