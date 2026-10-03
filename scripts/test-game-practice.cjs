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

const {
  createFocusedReviewWordPairs,
  createGameBoardPair,
  createInitialGameBoard,
  selectNextUniquePracticeWordPair,
} = loadTypeScript(path.resolve(repositoryRoot, 'src/features/Game/utils.ts'));

function createWordPairs(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: `word-${index + 1}`,
    word: `Word ${index + 1}`,
    translation: `Translation ${index + 1}`,
  }));
}

function completePracticePair(state, boardPairIndex) {
  const matchedBoardPair = state.board[boardPairIndex];
  const remainingBoard = state.board.filter(
    (boardPair) => boardPair.boardPairId !== matchedBoardPair.boardPairId,
  );
  const completedWordPairIds = [...state.completedWordPairIds, matchedBoardPair.wordPairId];
  const replacement = selectNextUniquePracticeWordPair(
    state.wordPairs,
    remainingBoard,
    state.nextPairIndex,
    completedWordPairIds,
  );

  if (!replacement) {
    return { ...state, board: remainingBoard, completedWordPairIds };
  }

  return {
    ...state,
    board: [
      ...remainingBoard,
      createGameBoardPair(replacement.wordPair, 'practice', replacement.sequenceIndex),
    ],
    completedWordPairIds,
    nextPairIndex: replacement.nextPairIndex,
  };
}

test('seven-word practice reaches 7/7 without recycling completed words', () => {
  const wordPairs = createWordPairs(7);
  let state = {
    wordPairs,
    board: createInitialGameBoard(wordPairs, 4, 'practice'),
    completedWordPairIds: [],
    nextPairIndex: 4,
  };

  for (let completedCount = 1; completedCount <= 6; completedCount += 1) {
    const boardPairIndex = completedCount % state.board.length;
    state = completePracticePair(state, boardPairIndex);

    assert.equal(new Set(state.completedWordPairIds).size, completedCount);
    assert.equal(
      state.board.some((boardPair) => state.completedWordPairIds.includes(boardPair.wordPairId)),
      false,
    );
  }

  assert.equal(state.completedWordPairIds.length, 6);
  assert.equal(state.board.length, 1);
  assert.equal(
    state.board[0].wordPairId,
    wordPairs.find((pair) => !state.completedWordPairIds.includes(pair.id)).id,
  );

  state = completePracticePair(state, 0);

  assert.equal(state.completedWordPairIds.length, 7);
  assert.equal(new Set(state.completedWordPairIds).size, 7);
  assert.equal(state.board.length, 0);
});

test('practice sets smaller than the board finish without replacements', () => {
  const wordPairs = createWordPairs(3);
  const initialBoard = createInitialGameBoard(wordPairs, 4, 'practice');
  const replacement = selectNextUniquePracticeWordPair(
    wordPairs,
    initialBoard.slice(1),
    wordPairs.length,
    [wordPairs[0].id],
  );

  assert.equal(initialBoard.length, 3);
  assert.equal(replacement, null);
});

for (const missedWordCount of [1, 2, 3, 4, 5]) {
  test(`focused review keeps ${missedWordCount} missed words and fills to its minimum`, () => {
    const wordPairs = createWordPairs(7);
    const missedWordPairIds = new Set(
      wordPairs.slice(0, missedWordCount).map((wordPair) => wordPair.id),
    );
    const focusedWordPairs = createFocusedReviewWordPairs(
      wordPairs,
      missedWordPairIds,
      4,
      () => 0.5,
    );

    assert.equal(focusedWordPairs.length, Math.max(4, missedWordCount));
    assert.equal(
      new Set(focusedWordPairs.map((wordPair) => wordPair.id)).size,
      focusedWordPairs.length,
    );
    for (const missedWordPairId of missedWordPairIds) {
      assert.equal(
        focusedWordPairs.some((wordPair) => wordPair.id === missedWordPairId),
        true,
      );
    }
  });
}

test('focused review uses every available word in an undersized round', () => {
  const wordPairs = createWordPairs(3);
  const focusedWordPairs = createFocusedReviewWordPairs(
    wordPairs,
    new Set([wordPairs[0].id]),
    4,
    () => 0.5,
  );

  assert.equal(focusedWordPairs.length, 3);
  assert.equal(new Set(focusedWordPairs.map((wordPair) => wordPair.id)).size, 3);
});

test('focused review stays empty when no words were missed', () => {
  const focusedWordPairs = createFocusedReviewWordPairs(createWordPairs(7), new Set(), 4);

  assert.equal(focusedWordPairs.length, 0);
});
