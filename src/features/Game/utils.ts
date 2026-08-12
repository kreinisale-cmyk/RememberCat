import { WordPair } from '@/features/GameSession/types';

import {
  FinalQuizAnswerChoice,
  GameBoardPair,
  GameStage,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairLearningStatistics,
  WordPairMismatchStatistics,
} from './types';
import {
  BOARD_SIZE,
  MAIN_ROUND_PRACTICE_KICKER,
  MAIN_ROUND_TIMED_KICKER_PREFIX,
  TIMED_ROUND_FIRST_BOARD_SIZE,
  TIMED_ROUND_PHASE_DURATION_SECONDS,
  TIMED_ROUND_SECOND_BOARD_SIZE,
  TIMED_ROUND_THIRD_BOARD_SIZE,
} from './constants';

type RandomNumberGenerator = () => number;

export function createEmptySelectedBoardPair(): SelectedBoardPair {
  return {
    wordBoardPairId: null,
    translationBoardPairId: null,
  };
}

export function isMatchingGameStage(gameStage: GameStage) {
  return gameStage === GameStage.MainRound || gameStage === GameStage.DifficultWordsPractice;
}

export function shuffle<T>(items: T[], generateRandomNumber: RandomNumberGenerator = Math.random) {
  const shuffledItems = [...items];

  for (let currentIndex = shuffledItems.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(generateRandomNumber() * (currentIndex + 1));
    const currentItem = shuffledItems[currentIndex];

    shuffledItems[currentIndex] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = currentItem;
  }

  return shuffledItems;
}

export function shuffleGameBoardAfterReplacement(
  gameBoard: GameBoardPair[],
  replacementBoardPairId: string,
  replacedBoardPairIndex: number,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  const shuffledGameBoard = shuffle(gameBoard, generateRandomNumber);

  if (shuffledGameBoard.length <= 1 || replacedBoardPairIndex < 0) {
    return shuffledGameBoard;
  }

  const replacementBoardPairIndex = shuffledGameBoard.findIndex(
    (gameBoardPair) => gameBoardPair.boardPairId === replacementBoardPairId,
  );

  if (replacementBoardPairIndex !== replacedBoardPairIndex) {
    return shuffledGameBoard;
  }

  const swapBoardPairIndex =
    replacedBoardPairIndex === shuffledGameBoard.length - 1 ? 0 : replacedBoardPairIndex + 1;
  const replacementBoardPair = shuffledGameBoard[replacementBoardPairIndex];

  shuffledGameBoard[replacementBoardPairIndex] = shuffledGameBoard[swapBoardPairIndex];
  shuffledGameBoard[swapBoardPairIndex] = replacementBoardPair;

  return shuffledGameBoard;
}

export function formatClock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export function createMainRoundKicker(isTimedMainRound: boolean, secondsRemaining: number) {
  if (isTimedMainRound) {
    return `${MAIN_ROUND_TIMED_KICKER_PREFIX} ${formatClock(secondsRemaining)}`;
  }

  return MAIN_ROUND_PRACTICE_KICKER;
}

export function createRoundProgressLabel(completedPairCount: number, targetPairCount: number) {
  return `${completedPairCount}/${targetPairCount}`;
}

export function createTimedRoundPhaseLabel(timedRoundPhase: TimedRoundPhase) {
  return `${timedRoundPhase}/3`;
}

export function getTimedRoundPhase(secondsRemaining: number) {
  if (secondsRemaining > TIMED_ROUND_PHASE_DURATION_SECONDS * 2) {
    return TimedRoundPhase.FourCards;
  } else if (secondsRemaining > TIMED_ROUND_PHASE_DURATION_SECONDS) {
    return TimedRoundPhase.FiveCards;
  } else {
    return TimedRoundPhase.SixCards;
  }
}

export function getTimedRoundBoardSize(timedRoundPhase: TimedRoundPhase) {
  if (timedRoundPhase === TimedRoundPhase.FourCards) {
    return TIMED_ROUND_FIRST_BOARD_SIZE;
  } else if (timedRoundPhase === TimedRoundPhase.FiveCards) {
    return TIMED_ROUND_SECOND_BOARD_SIZE;
  } else {
    return TIMED_ROUND_THIRD_BOARD_SIZE;
  }
}

export function getInitialMainRoundBoardSize(isTimedMainRound: boolean) {
  if (isTimedMainRound) {
    return TIMED_ROUND_FIRST_BOARD_SIZE;
  }

  return BOARD_SIZE;
}

export function createGameBoardPair(
  wordPair: WordPair,
  boardPairIdPrefix: string,
  sequenceIndex: number,
): GameBoardPair {
  return {
    boardPairId: `${boardPairIdPrefix}-${sequenceIndex}-${wordPair.id}`,
    wordPairId: wordPair.id,
    word: wordPair.word,
    translation: wordPair.translation,
  };
}

export function selectNextUniquePracticeWordPair(
  difficultWordPairs: WordPair[],
  remainingGameBoard: GameBoardPair[],
  nextPracticePairIndex: number,
) {
  if (difficultWordPairs.length === 0) {
    return null;
  }

  const visibleWordPairIds = new Set(
    remainingGameBoard.map((gameBoardPair) => gameBoardPair.wordPairId),
  );

  for (let candidateOffset = 0; candidateOffset < difficultWordPairs.length; candidateOffset += 1) {
    const candidateSequenceIndex = nextPracticePairIndex + candidateOffset;
    const candidateWordPair =
      difficultWordPairs[candidateSequenceIndex % difficultWordPairs.length];

    if (!visibleWordPairIds.has(candidateWordPair.id)) {
      return {
        wordPair: candidateWordPair,
        sequenceIndex: candidateSequenceIndex,
        nextPairIndex: candidateSequenceIndex + 1,
      };
    }
  }

  return null;
}

export function createInitialGameBoard(
  wordPairs: WordPair[],
  boardSize: number,
  boardPairIdPrefix: string,
) {
  return wordPairs
    .slice(0, boardSize)
    .map((wordPair, sequenceIndex) =>
      createGameBoardPair(wordPair, boardPairIdPrefix, sequenceIndex),
    );
}

export function createInitialMismatchStatistics(wordPairs: WordPair[]) {
  return wordPairs.map<WordPairMismatchStatistics>((wordPair) => ({
    wordPairId: wordPair.id,
    mismatchCount: 0,
  }));
}

export function incrementWordPairMismatchCount(
  mismatchStatistics: WordPairMismatchStatistics[],
  wordPairId: string,
) {
  return mismatchStatistics.map((wordPairStatistics) => {
    if (wordPairStatistics.wordPairId === wordPairId) {
      return {
        ...wordPairStatistics,
        mismatchCount: wordPairStatistics.mismatchCount + 1,
      };
    }

    return wordPairStatistics;
  });
}

export function selectDifficultWordPairs(
  wordPairs: WordPair[],
  mismatchStatistics: WordPairMismatchStatistics[],
  selectionCount: number,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  const mismatchCountByWordPairId = createMismatchCountByWordPairId(mismatchStatistics);
  const originalIndexByWordPairId = new Map(
    wordPairs.map((wordPair, originalIndex) => [wordPair.id, originalIndex]),
  );
  const failedWordPairs = wordPairs
    .filter((wordPair) => (mismatchCountByWordPairId.get(wordPair.id) ?? 0) > 0)
    .sort((firstWordPair, secondWordPair) => {
      const mismatchDifference =
        (mismatchCountByWordPairId.get(secondWordPair.id) ?? 0) -
        (mismatchCountByWordPairId.get(firstWordPair.id) ?? 0);

      if (mismatchDifference !== 0) {
        return mismatchDifference;
      }

      return (
        (originalIndexByWordPairId.get(firstWordPair.id) ?? 0) -
        (originalIndexByWordPairId.get(secondWordPair.id) ?? 0)
      );
    });
  const selectedFailedWordPairs = failedWordPairs.slice(0, selectionCount);
  const remainingSelectionCount = selectionCount - selectedFailedWordPairs.length;

  if (remainingSelectionCount <= 0) {
    return selectedFailedWordPairs;
  }

  const failedWordPairIds = new Set(failedWordPairs.map((wordPair) => wordPair.id));
  const zeroMismatchWordPairs = wordPairs.filter((wordPair) => !failedWordPairIds.has(wordPair.id));
  const randomlySelectedWordPairs = shuffle(zeroMismatchWordPairs, generateRandomNumber).slice(
    0,
    remainingSelectionCount,
  );

  return [...selectedFailedWordPairs, ...randomlySelectedWordPairs];
}

export function createShuffledFinalQuizWordPairs(
  difficultWordPairs: WordPair[],
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  return shuffle(difficultWordPairs, generateRandomNumber);
}

export function createFinalQuizAnswerChoices(
  questionWordPair: WordPair,
  difficultWordPairs: WordPair[],
  choiceCount: number,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  if (choiceCount <= 0) {
    return [];
  }

  const usedTranslations = new Set([normalizeTranslation(questionWordPair.translation)]);
  const shuffledDistractorCandidates = shuffle(
    difficultWordPairs.filter((wordPair) => wordPair.id !== questionWordPair.id),
    generateRandomNumber,
  );
  const uniqueDistractorChoices: FinalQuizAnswerChoice[] = [];

  for (const distractorWordPair of shuffledDistractorCandidates) {
    const normalizedTranslation = normalizeTranslation(distractorWordPair.translation);

    if (!usedTranslations.has(normalizedTranslation)) {
      usedTranslations.add(normalizedTranslation);
      uniqueDistractorChoices.push({
        wordPairId: distractorWordPair.id,
        translation: distractorWordPair.translation,
      });
    }

    if (uniqueDistractorChoices.length >= choiceCount - 1) {
      break;
    }
  }

  return shuffle(
    [
      {
        wordPairId: questionWordPair.id,
        translation: questionWordPair.translation,
      },
      ...uniqueDistractorChoices,
    ],
    generateRandomNumber,
  );
}

export function createLearningStatistics(
  wordPairs: WordPair[],
  mismatchStatistics: WordPairMismatchStatistics[],
  practicedWordPairIds: Set<string>,
) {
  const mismatchCountByWordPairId = createMismatchCountByWordPairId(mismatchStatistics);
  const originalIndexByWordPairId = new Map(
    wordPairs.map((wordPair, originalIndex) => [wordPair.id, originalIndex]),
  );

  return wordPairs
    .map<WordPairLearningStatistics>((wordPair) => ({
      ...wordPair,
      mismatchCount: mismatchCountByWordPairId.get(wordPair.id) ?? 0,
      isPracticed: practicedWordPairIds.has(wordPair.id),
    }))
    .sort((firstStatistics, secondStatistics) => {
      const mismatchDifference = secondStatistics.mismatchCount - firstStatistics.mismatchCount;

      if (mismatchDifference !== 0) {
        return mismatchDifference;
      }

      return (
        (originalIndexByWordPairId.get(firstStatistics.id) ?? 0) -
        (originalIndexByWordPairId.get(secondStatistics.id) ?? 0)
      );
    });
}

export function findGameBoardPair(gameBoard: GameBoardPair[], boardPairId: string) {
  return gameBoard.find((gameBoardPair) => gameBoardPair.boardPairId === boardPairId);
}

export function haveMatchingTranslations(
  wordGameBoardPair: GameBoardPair,
  translationGameBoardPair: GameBoardPair,
) {
  return (
    normalizeTranslation(wordGameBoardPair.translation) ===
    normalizeTranslation(translationGameBoardPair.translation)
  );
}

function createMismatchCountByWordPairId(mismatchStatistics: WordPairMismatchStatistics[]) {
  return new Map(
    mismatchStatistics.map((wordPairStatistics) => [
      wordPairStatistics.wordPairId,
      wordPairStatistics.mismatchCount,
    ]),
  );
}

function normalizeTranslation(translation: string) {
  return translation.trim().toLocaleLowerCase();
}
