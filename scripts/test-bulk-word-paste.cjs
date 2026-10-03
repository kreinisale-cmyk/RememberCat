const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const repositoryRoot = path.resolve(__dirname, '..');
const modules = new Map();

function resolveTypeScriptModule(request, parentFilename) {
  const unresolvedPath = request.startsWith('@/')
    ? path.resolve(repositoryRoot, 'src', request.slice(2))
    : path.resolve(path.dirname(parentFilename), request);

  for (const extension of ['.ts', '.tsx']) {
    if (fs.existsSync(unresolvedPath + extension)) return unresolvedPath + extension;
  }

  return unresolvedPath;
}

function loadTypeScript(filename) {
  if (modules.has(filename)) return modules.get(filename).exports;

  const module = { exports: {} };
  modules.set(filename, module);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = {
    module,
    exports: module.exports,
    console,
    Date,
    Math,
    require(request) {
      if (request.startsWith('.') || request.startsWith('@/')) {
        return loadTypeScript(resolveTypeScriptModule(request, filename));
      }

      return require(request);
    },
  };

  vm.runInNewContext(compiled, context, { filename });
  return module.exports;
}

const buildYourDeckUtils = loadTypeScript(
  path.resolve(repositoryRoot, 'src/features/BuildYourDeck/utils.ts'),
);
const buildYourDeckTypes = loadTypeScript(
  path.resolve(repositoryRoot, 'src/features/BuildYourDeck/types.ts'),
);
const bulkPasteIssueUtils = loadTypeScript(
  path.resolve(
    repositoryRoot,
    'src/features/BuildYourDeck/components/BulkWordPairModal/components/BulkPasteIssues/utils.ts',
  ),
);
const {
  analyzeBulkWordPairPaste,
  cleanBulkPasteField,
  createBulkWordPairAdditionMessage,
  createLongWordReviewKey,
  createLongWordReviewPair,
} = buildYourDeckUtils;
const { BulkPasteLineIssue, BulkPasteStatus } = buildYourDeckTypes;
const {
  createBulkPasteIssueToggleLabel,
  selectBulkPasteIssueResults,
  selectVisibleBulkPasteIssueResults,
  shouldShowBulkPasteIssueToggle,
} = bulkPasteIssueUtils;

function pair(id, word, translation) {
  return { id, word, translation };
}

test('empty input stays neutral', () => {
  const analysis = analyzeBulkWordPairPaste('  \n\r\n', [], 6);

  assert.equal(analysis.status, BulkPasteStatus.Neutral);
  assert.equal(analysis.acceptedCandidates.length, 0);
});

test('accepts supported separators, mixed formats, Windows lines, and multilingual text', () => {
  const contents = 'cat - gato\r\nwater\tagua\r\nsun:sol\r\nשלום,hello';
  const analysis = analyzeBulkWordPairPaste(contents, [], 6);

  assert.equal(analysis.status, BulkPasteStatus.Warning);
  assert.equal(analysis.acceptedCandidates.length, 4);
  assert.equal(analysis.missingPairCount, 2);
  assert.equal(analysis.acceptedCandidates[3].word, 'שלום');
});

test('reports missing values, separators, and extra fields with original line numbers', () => {
  const analysis = analyzeBulkWordPairPaste('- gato\nsun -\njust words\na,b,c', [], 6);

  assert.equal(analysis.status, BulkPasteStatus.Error);
  assert.equal(analysis.lineResults[0].issue, BulkPasteLineIssue.MissingWord);
  assert.equal(analysis.lineResults[1].issue, BulkPasteLineIssue.MissingTranslation);
  assert.equal(analysis.lineResults[2].issue, BulkPasteLineIssue.MissingSeparator);
  assert.equal(analysis.lineResults[3].issue, BulkPasteLineIssue.ExtraFields);
  assert.equal(analysis.lineResults[3].lineNumber, 4);
});

test('preserves hyphens inside values when a spaced hyphen separates the pair', () => {
  const analysis = analyzeBulkWordPairPaste('mother-in-law - belle-mère', [], 1);

  assert.equal(analysis.status, BulkPasteStatus.Ready);
  assert.equal(analysis.acceptedCandidates[0].word, 'mother-in-law');
  assert.equal(analysis.acceptedCandidates[0].translation, 'belle-mère');
});

test('finds duplicate words and translations against the deck and accepted paste lines', () => {
  const existingPairs = [pair('1', 'Cat', 'Gato')];
  const analysis = analyzeBulkWordPairPaste(
    ' cat - chat\ndog - gato\nwater - agua\nWATER - eau',
    existingPairs,
    6,
  );

  assert.equal(analysis.lineResults[0].issue, BulkPasteLineIssue.DuplicateWord);
  assert.equal(analysis.lineResults[1].issue, BulkPasteLineIssue.DuplicateTranslation);
  assert.equal(analysis.lineResults[2].issue, null);
  assert.equal(analysis.lineResults[3].issue, BulkPasteLineIssue.DuplicateWord);
  assert.equal(analysis.remainingContents, ' cat - chat\ndog - gato\nWATER - eau');
});

test('accepts in order to capacity and reports every overflow line', () => {
  const existingPairs = [pair('1', 'one', 'uno')];
  const analysis = analyzeBulkWordPairPaste(
    'two - dos\nthree - tres\nfour - cuatro',
    existingPairs,
    3,
  );

  assert.equal(analysis.acceptedCandidates.length, 2);
  assert.equal(analysis.status, BulkPasteStatus.Warning);
  assert.equal(analysis.lineResults[2].issue, BulkPasteLineIssue.DeckLimit);
  assert.equal(analysis.remainingContents, 'four - cuatro');
});

test('uses green only when clean input fills the deck exactly', () => {
  const existingPairs = [pair('1', 'one', 'uno')];
  const analysis = analyzeBulkWordPairPaste('two - dos\nthree - tres', existingPairs, 3);

  assert.equal(analysis.status, BulkPasteStatus.Ready);
  assert.equal(analysis.readyPairCount, 3);
  assert.equal(analysis.remainingContents, '');
});

test('all-duplicate and full-deck inputs stay yellow and cannot add', () => {
  const existingPairs = [pair('1', 'cat', 'gato')];
  const duplicateAnalysis = analyzeBulkWordPairPaste('CAT - chat', existingPairs, 6);
  const fullAnalysis = analyzeBulkWordPairPaste('dog - perro', existingPairs, 1);

  assert.equal(duplicateAnalysis.status, BulkPasteStatus.Warning);
  assert.equal(duplicateAnalysis.acceptedCandidates.length, 0);
  assert.equal(fullAnalysis.status, BulkPasteStatus.Warning);
  assert.equal(fullAnalysis.lineResults[0].issue, BulkPasteLineIssue.DeckLimit);
});

test('partial additions keep only unresolved lines and report them accurately', () => {
  const firstAnalysis = analyzeBulkWordPairPaste('cat - gato\nsun -', [], 6);
  const addedPairs = firstAnalysis.acceptedCandidates.map((candidate, index) =>
    pair(String(index), candidate.word, candidate.translation),
  );
  const secondAnalysis = analyzeBulkWordPairPaste(firstAnalysis.remainingContents, addedPairs, 6);

  assert.equal(firstAnalysis.remainingContents, 'sun -');
  assert.equal(secondAnalysis.acceptedCandidates.length, 0);
  assert.equal(secondAnalysis.lineResults[0].issue, BulkPasteLineIssue.MissingTranslation);
  assert.equal(createBulkWordPairAdditionMessage(1, 1), 'Added 1 word pair. Kept 1 line to fix.');
});

test('removes formatting noise around both pasted values', () => {
  const examples = [
    ['****cat**-gato', 'cat', 'gato'],
    ['**cat** - __gato__', 'cat', 'gato'],
    ['"cat" - (gato!)', 'cat', 'gato'],
    ["**don't** - **no hagas**", "don't", 'no hagas'],
  ];

  for (const [contents, expectedWord, expectedTranslation] of examples) {
    const analysis = analyzeBulkWordPairPaste(contents, [], 1);

    assert.equal(analysis.acceptedCandidates[0].word, expectedWord);
    assert.equal(analysis.acceptedCandidates[0].translation, expectedTranslation);
  }
});

test('preserves Unicode text, combining marks, and internal punctuation while cleaning edges', () => {
  assert.equal(cleanBulkPasteField('***mother-in-law!'), 'mother-in-law');
  assert.equal(cleanBulkPasteField("__don't__"), "don't");
  assert.equal(cleanBulkPasteField('***שָׁלוֹם***'), 'שָׁלוֹם');
  assert.equal(cleanBulkPasteField('...café?!'), 'café');
  assert.equal(cleanBulkPasteField('***́***'), '');
});

test('treats symbol-only fields as missing and retains the original skipped line', () => {
  const missingAnalysis = analyzeBulkWordPairPaste('*** - gato', [], 1);
  const duplicateAnalysis = analyzeBulkWordPairPaste(
    '**cat** - __gato__',
    [pair('1', 'cat', 'chat')],
    2,
  );

  assert.equal(missingAnalysis.lineResults[0].issue, BulkPasteLineIssue.MissingWord);
  assert.equal(duplicateAnalysis.lineResults[0].issue, BulkPasteLineIssue.DuplicateWord);
  assert.equal(duplicateAnalysis.remainingContents, '**cat** - __gato__');
});

test('previews two issues and exposes expansion only for longer lists', () => {
  const lineResults = Array.from({ length: 15 }, (_, index) => ({
    lineNumber: index + 1,
    originalLine: `bad line ${index + 1}`,
    word: '',
    translation: '',
    issue: BulkPasteLineIssue.MissingSeparator,
  }));
  const issueResults = selectBulkPasteIssueResults(lineResults);

  assert.equal(selectBulkPasteIssueResults([]).length, 0);
  assert.equal(shouldShowBulkPasteIssueToggle(1), false);
  assert.equal(shouldShowBulkPasteIssueToggle(2), false);
  assert.equal(shouldShowBulkPasteIssueToggle(3), true);
  assert.equal(selectVisibleBulkPasteIssueResults(issueResults, false).length, 2);
  assert.equal(selectVisibleBulkPasteIssueResults(issueResults, true).length, 15);
  assert.equal(createBulkPasteIssueToggleLabel(15, false), 'Show all 15 issues');
  assert.equal(createBulkPasteIssueToggleLabel(15, true), 'Show fewer');
});

test('accepts a complete formatted 15-word vocabulary list', () => {
  const contents = [
    'Here are 15 common Spanish words with their English translations:',
    '',
    '- **gato** – cat',
    '  \\',
    '- **perro** – dog',
    '  \\',
    '- **casa** – house',
    '  \\',
    '- **agua** – water',
    '  \\',
    '- **comida** – food',
    '  \\',
    '- **libro** – book',
    '  \\',
    '- **amigo** – friend',
    '  \\',
    '- **sol** – sun',
    '  \\',
    '- **luna** – moon',
    '  \\',
    '- **árbol** – tree',
    '  \\',
    '- **flor** – flower',
    '  \\',
    '- **tiempo** – time / weather',
    '  \\',
    '- **familia** – family',
    '  \\',
    '- **ciudad** – city',
    '  \\',
    '- **amor** – love',
  ].join('\n');
  const analysis = analyzeBulkWordPairPaste(contents, [], 15);

  assert.equal(analysis.status, BulkPasteStatus.Ready);
  assert.equal(analysis.acceptedCandidates.length, 15);
  assert.equal(analysis.lineResults.length, 15);
  assert.equal(analysis.acceptedCandidates[0].word, 'gato');
  assert.equal(analysis.acceptedCandidates[9].word, 'árbol');
  assert.equal(analysis.acceptedCandidates[11].translation, 'time / weather');
  assert.equal(analysis.remainingContents, '');
});

test('accepts short, en, and em dashes with common list markers', () => {
  const contents = [
    '- **cat** - gato',
    '* dog–perro',
    '+ house — casa',
    '• water – agua',
    '1. food - comida',
    '2) book — libro',
  ].join('\r\n');
  const analysis = analyzeBulkWordPairPaste(contents, [], 6);

  assert.equal(analysis.status, BulkPasteStatus.Ready);
  assert.equal(analysis.acceptedCandidates.length, 6);
  assert.equal(analysis.acceptedCandidates[5].translation, 'libro');
});

test('ignores list introductions and formatting while retaining malformed entry line numbers', () => {
  const contents = [
    'A useful vocabulary list:',
    '---',
    '\\',
    '- **cat** – gato',
    '- **sun** –',
  ].join('\n');
  const analysis = analyzeBulkWordPairPaste(contents, [], 2);

  assert.equal(analysis.acceptedCandidates.length, 1);
  assert.equal(analysis.lineResults.length, 2);
  assert.equal(analysis.lineResults[1].lineNumber, 5);
  assert.equal(analysis.lineResults[1].issue, BulkPasteLineIssue.MissingTranslation);
  assert.equal(analysis.remainingContents, '- **sun** –');
});

test('introductory text alone never becomes a valid pair', () => {
  const analysis = analyzeBulkWordPairPaste(
    'Here are common Spanish words with their English translations:',
    [],
    6,
  );

  assert.equal(analysis.acceptedCandidates.length, 0);
  assert.equal(analysis.status, BulkPasteStatus.Error);
});

test('formatted lists retain duplicate and overflow validation', () => {
  const existingPairs = [pair('1', 'cat', 'gato')];
  const duplicateAnalysis = analyzeBulkWordPairPaste('- **cat** – chat', existingPairs, 3);
  const overflowAnalysis = analyzeBulkWordPairPaste(
    '- **dog** – perro\n- **house** – casa',
    existingPairs,
    2,
  );

  assert.equal(duplicateAnalysis.lineResults[0].issue, BulkPasteLineIssue.DuplicateWord);
  assert.equal(overflowAnalysis.acceptedCandidates.length, 1);
  assert.equal(overflowAnalysis.lineResults[1].issue, BulkPasteLineIssue.DeckLimit);
});

test('reviews individual words over 10 characters in either field', () => {
  const exactlyTen = createLongWordReviewPair('abcdefghij', 'shortword');
  const longWord = createLongWordReviewPair('abcdefghijk', 'short');
  const longTranslation = createLongWordReviewPair('short', 'extraordinary');

  assert.equal(exactlyTen, null);
  assert.equal(longWord.findings[0].longWord, 'abcdefghijk');
  assert.equal(longWord.findings[0].characterCount, 11);
  assert.equal(longWord.findings[0].field, buildYourDeckTypes.WordPairField.Word);
  assert.equal(longTranslation.findings[0].field, buildYourDeckTypes.WordPairField.Translation);
});

test('checks words rather than complete phrases and excludes punctuation from counts', () => {
  assert.equal(createLongWordReviewPair('time / weather', 'short'), null);
  assert.equal(createLongWordReviewPair('mother-in-law', 'short'), null);

  const apostropheReview = createLongWordReviewPair("abcdefghij'k!", 'short');
  const hyphenReview = createLongWordReviewPair('extraordinary-word', 'short');

  assert.equal(apostropheReview.findings[0].longWord, "abcdefghij'k");
  assert.equal(apostropheReview.findings[0].characterCount, 11);
  assert.equal(hyphenReview.findings.length, 1);
  assert.equal(hyphenReview.findings[0].longWord, 'extraordinary');
});

test('counts accented and combining-mark text by visible letters', () => {
  const composedReview = createLongWordReviewPair('ééééééééééé', 'short');
  const combiningReview = createLongWordReviewPair('ááááááááááá', 'short');
  const hebrewReview = createLongWordReviewPair('א́ב́ג́ד́ה́ו́ז́ח́ט́י́כ́', 'short');

  assert.equal(composedReview.findings[0].characterCount, 11);
  assert.equal(combiningReview.findings[0].characterCount, 11);
  assert.equal(hebrewReview.findings[0].characterCount, 11);
});

test('only accepted pasted pairs create long-word reviews', () => {
  const existingPairs = [pair('1', 'extraordinary', 'known')];
  const analysis = analyzeBulkWordPairPaste(
    'extraordinary - duplicate\nshort - extraordinarily\noverflowingword - overflow',
    existingPairs,
    2,
  );

  assert.equal(analysis.acceptedCandidates.length, 1);
  assert.equal(analysis.longWordReviewPairs.length, 1);
  assert.equal(analysis.longWordReviewPairs[0].lineNumber, 2);
  assert.equal(analysis.lineResults[0].issue, BulkPasteLineIssue.DuplicateWord);
  assert.equal(analysis.lineResults[2].issue, BulkPasteLineIssue.DeckLimit);
});

test('review keys change with the submitted values', () => {
  const firstReview = createLongWordReviewPair('extraordinary', 'short');
  const secondReview = createLongWordReviewPair('extraordinarily', 'short');

  assert.notEqual(createLongWordReviewKey([firstReview]), createLongWordReviewKey([secondReview]));
});
