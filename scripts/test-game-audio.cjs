const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

// Exercise the production TypeScript without adding a test framework or native mocks to the app.
const modules = new Map();
function loadTypeScript(relativePath) {
  const filename = path.resolve(__dirname, '..', relativePath);
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = {
    module,
    exports: module.exports,
    __DEV__: false,
    console,
    setTimeout,
    clearTimeout,
    AbortController,
    Error,
    require(request) {
      if (request.startsWith('.')) {
        return loadTypeScript(
          path.relative(
            path.resolve(__dirname, '..'),
            path.resolve(path.dirname(filename), request + '.ts'),
          ),
        );
      }
      return require(request);
    },
  };
  vm.runInNewContext(compiled, context, { filename });
  return module.exports;
}

const { createShuffledSoundBag, selectGameOutcomeFeedback, isAnswerOutcome } = loadTypeScript(
  'src/features/Game/hooks/useGameFeedback/utils.ts',
);
const { playAudioCue, prepareAudioCueForReplay } = loadTypeScript(
  'src/features/Game/hooks/useGameAudioPlayback/playback.ts',
);
const { isMatchingAudioCue, shouldReportAudioCueCancellation } = loadTypeScript(
  'src/features/Game/hooks/useGameAudioPlayback/utils.ts',
);
const { AudioCuePhase } = loadTypeScript('src/features/Game/hooks/useGameAudioPlayback/types.ts');
const { GameStage, MatchFeedback, ReinforcementFeedback, FinalQuizFeedback } = loadTypeScript(
  'src/features/Game/types.ts',
);

function mockPlayer({ loaded = false, seek, playbackStarts = true } = {}) {
  const listeners = new Set();
  const player = {
    calls: [],
    listeners,
    currentStatus: {
      isLoaded: loaded,
      playing: false,
      currentTime: 0,
      playbackState: loaded ? 'ready' : 'loading',
      error: null,
    },
    addListener(event, listener) {
      listeners.add(listener);
      return { remove: () => listeners.delete(listener) };
    },
    update(update) {
      player.currentStatus = { ...player.currentStatus, ...update };
      for (const listener of [...listeners]) listener(player.currentStatus);
    },
    async seekTo() {
      assert.equal(player.currentStatus.isLoaded, true, 'must load before seeking');
      player.calls.push('seek');
      if (seek) await seek();
      player.update({ currentTime: 0, playbackState: 'ready', isLoaded: true });
    },
    play() {
      player.calls.push('play');
      if (playbackStarts) player.update({ playing: true });
    },
    pause() {
      player.calls.push('pause');
    },
  };
  return player;
}

function request(
  player,
  signal = new AbortController().signal,
  loadTimeoutMs = 250,
  isPreparedForReplay = false,
) {
  return playAudioCue({
    player,
    filename: 'test.wav',
    signal,
    loadTimeoutMs,
    isPreparedForReplay,
  });
}

test('every shuffled bag contains every sound, with no repeated boundary', () => {
  const firstIndices = new Set();
  for (let seed = 1; seed <= 100; seed++) {
    let state = Math.imul(seed, 0x9e3779b9) >>> 0;
    const random = () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32;
    let previous = null;
    for (let cycle = 0; cycle < 20; cycle++) {
      const bag = [...createShuffledSoundBag(3, previous, random)];
      assert.deepEqual([...bag].sort(), [0, 1, 2]);
      assert.notEqual(bag[0], previous);
      if (!cycle) firstIndices.add(bag[0]);
      previous = bag.at(-1);
    }
  }
  assert.deepEqual([...firstIndices].sort(), [0, 1, 2]);
});

test('all evaluated answer stages produce exactly one corresponding sound outcome', () => {
  const base = {
    hasActiveSession: true,
    gameStage: GameStage.MainRound,
    preparationWordIndex: 0,
    matchFeedback: MatchFeedback.None,
    reinforcementFeedback: ReinforcementFeedback.None,
    finalQuizFeedback: FinalQuizFeedback.None,
  };
  const stages = [
    [GameStage.MainRound, 'matchFeedback', MatchFeedback.Correct, MatchFeedback.Incorrect],
    [
      GameStage.DifficultWordsPractice,
      'matchFeedback',
      MatchFeedback.Correct,
      MatchFeedback.Incorrect,
    ],
    [
      GameStage.EasyReinforcement,
      'reinforcementFeedback',
      ReinforcementFeedback.Correct,
      ReinforcementFeedback.Incorrect,
    ],
    [GameStage.FinalQuiz, 'finalQuizFeedback', FinalQuizFeedback.Correct, FinalQuizFeedback.Miss],
  ];
  for (const [gameStage, field, correct, incorrect] of stages) {
    const previous = { ...base, gameStage };
    for (const [value, expected] of [
      [correct, 'correct'],
      [incorrect, 'incorrect'],
    ]) {
      const current = { ...previous, [field]: value };
      assert.equal(selectGameOutcomeFeedback(current, previous), expected);
      assert.equal(selectGameOutcomeFeedback(current, current), null);
      assert.equal(selectGameOutcomeFeedback(previous, current), null);
      assert.equal(
        selectGameOutcomeFeedback(current, previous),
        expected,
        'same outcome may play again after resetting',
      );
    }
  }
  assert.equal(
    isAnswerOutcome(
      selectGameOutcomeFeedback({ ...base, gameStage: GameStage.LearningStatistics }, base),
    ),
    false,
  );
});

test('ready players at the start play without a tap-time seek', async () => {
  const player = mockPlayer({ loaded: true });
  await request(player);
  assert.deepEqual(player.calls, ['play']);
  assert.equal(player.listeners.size, 0);
});

test('completed players are rewound before replay and can then play without another seek', async () => {
  const player = mockPlayer({ loaded: true });
  player.currentStatus.currentTime = 0.3;
  player.currentStatus.playbackState = 'ended';
  assert.equal(await prepareAudioCueForReplay(player, new AbortController().signal), true);
  assert.deepEqual(player.calls, ['pause', 'seek']);
  player.currentStatus.currentTime = 0.004;

  await request(player, new AbortController().signal, 250, true);
  assert.deepEqual(player.calls, ['pause', 'seek', 'play']);
});

test('cue identity rejects late events and cancellation is reported only while active', () => {
  const player = mockPlayer({ loaded: true });
  const finishedPlayer = mockPlayer({ loaded: true });
  const controller = new AbortController();
  const activeCue = {
    controller,
    filename: 'current.wav',
    phase: AudioCuePhase.Playing,
    player,
    removeStatusListener() {},
    requestId: 2,
  };
  const staleCue = { ...activeCue, player: finishedPlayer, requestId: 1 };

  assert.equal(isMatchingAudioCue(activeCue, activeCue), true);
  assert.equal(isMatchingAudioCue(activeCue, staleCue), false);
  assert.equal(shouldReportAudioCueCancellation(activeCue), false);
  player.currentStatus.playing = true;
  assert.equal(shouldReportAudioCueCancellation(activeCue), true);
  activeCue.phase = AudioCuePhase.Pending;
  player.currentStatus.playing = false;
  assert.equal(shouldReportAudioCueCancellation(activeCue), true);
});

test('cold intro loads longer than 500 ms without triggering playback-start timeout', async () => {
  const player = mockPlayer();
  const pending = request(player, new AbortController().signal, 2000);
  setTimeout(() => player.update({ isLoaded: true }), 600);
  await pending;
  assert.deepEqual(player.calls, ['play']);
});

test('answer readiness waits for a delayed load inside 250 ms', async () => {
  const player = mockPlayer();
  const pending = request(player);
  setTimeout(() => player.update({ isLoaded: true }), 30);
  await pending;
  assert.deepEqual(player.calls, ['play']);
});

test('expired readiness never starts late playback', async () => {
  const player = mockPlayer();
  await assert.rejects(request(player, new AbortController().signal, 20), /loaded timeout/);
  player.update({ isLoaded: true });
  assert.deepEqual(player.calls, []);
  assert.equal(player.listeners.size, 0);
});

for (const reason of ['superseded', 'muted', 'route exit', 'background']) {
  test(`${reason} cancels pending loading and seeking`, async () => {
    for (const loaded of [false, true]) {
      const controller = new AbortController();
      let finishSeek;
      const player = mockPlayer({
        loaded,
        seek: () =>
          new Promise((resolve) => {
            finishSeek = resolve;
          }),
      });
      if (loaded) player.currentStatus.currentTime = 0.3;
      const pending = request(player, controller.signal);
      await new Promise((resolve) => setTimeout(resolve, 0));
      controller.abort();
      finishSeek?.();
      await assert.rejects(pending, { name: 'AbortError' });
      player.update({ isLoaded: true });
      assert.equal(player.calls.includes('play'), false);
      assert.equal(player.listeners.size, 0);
    }
  });
}

test('load errors propagate for diagnostics and silent fallback', async () => {
  const player = mockPlayer();
  const pending = request(player);
  player.update({ error: 'Asset could not be decoded' });
  await assert.rejects(pending, /could not be decoded/);
  assert.equal(player.listeners.size, 0);
});

test('a native play exception is surfaced without leaking a rejected waiter', async () => {
  const player = mockPlayer({ loaded: true });
  player.play = () => {
    throw new Error('Native playback failed');
  };
  await assert.rejects(request(player), /Native playback failed/);
  assert.equal(player.listeners.size, 0);
});

test('playback must actually start within its separate 500 ms deadline', async () => {
  const player = mockPlayer({ loaded: true, playbackStarts: false });
  await assert.rejects(request(player), /playing timeout after 500 ms/);
  assert.equal(player.listeners.size, 0);
});
