import {
  AttemptCount,
  CompletedAssessmentStatistic,
  CompletedWordStatistic,
  FocusMode,
  GameAttemptPhase,
  GameSession,
  MatchMode,
  WordAttemptStatistic,
  WordPair,
  WordMastery,
} from '@/features/GameSession/types';
import { applyAssessmentToWordMastery, createNewWordMastery } from '@/features/GameSession/utils';

import {
  FinalQuizAnswerChoice,
  CompletedGameResult,
  FocusedReviewState,
  GameBoardPair,
  GameStage,
  MatchCelebrationAnimation,
  ReinforcementAnswerChoice,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairLearningStatistics,
  WordPairMismatchStatistics,
} from './types';
import {
  BOARD_SIZE,
  CHALLENGE_STAGE_MATCH_GOAL,
  MATCH_CELEBRATION_ANIMATIONS,
  MAIN_ROUND_EASY_HINT,
  MAIN_ROUND_HARD_HINT,
  MAIN_ROUND_PRACTICE_KICKER,
  MAIN_ROUND_TIMED_KICKER_PREFIX,
  PRACTICE_ROUND_EASY_HINT,
  PRACTICE_ROUND_HARD_HINT,
  TIMED_ROUND_FIRST_BOARD_SIZE,
  TIMED_ROUND_SECOND_BOARD_SIZE,
  TIMED_ROUND_THIRD_BOARD_SIZE,
  STANDARD_CHALLENGE_STAGE_SECONDS,
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

export function selectMatchingAttemptPhase(
  gameStage: GameStage,
  focusedReviewState: FocusedReviewState,
) {
  if (gameStage === GameStage.MainRound) {
    return GameAttemptPhase.MainChallenge;
  } else if (focusedReviewState === FocusedReviewState.Practice) {
    return GameAttemptPhase.FocusedReviewPractice;
  }

  return GameAttemptPhase.DifficultPractice;
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

export function selectNextMatchCelebrationAnimation(
  previousAnimation: MatchCelebrationAnimation | null,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  let animationCandidates = MATCH_CELEBRATION_ANIMATIONS;

  if (previousAnimation) {
    animationCandidates = MATCH_CELEBRATION_ANIMATIONS.filter(
      (animation) => animation !== previousAnimation,
    );
  }

  const randomAnimationIndex = Math.min(
    Math.floor(generateRandomNumber() * animationCandidates.length),
    animationCandidates.length - 1,
  );

  return animationCandidates[randomAnimationIndex] ?? MatchCelebrationAnimation.Burst;
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

export function createMainRoundKicker(
  isTimedMainRound: boolean,
  secondsRemaining: number,
  timedRoundPhase: TimedRoundPhase,
) {
  const stageLabel = `STAGE ${timedRoundPhase} OF 3`;

  if (isTimedMainRound) {
    return `${stageLabel}  |  ${MAIN_ROUND_TIMED_KICKER_PREFIX} ${formatClock(secondsRemaining)}`;
  }

  return `${stageLabel}  |  ${MAIN_ROUND_PRACTICE_KICKER}`;
}

export function createRoundProgressLabel(completedPairCount: number, targetPairCount: number) {
  return `${completedPairCount}/${targetPairCount}`;
}

export function createMainRoundHint(matchMode: MatchMode) {
  if (matchMode === MatchMode.Hard) {
    return MAIN_ROUND_HARD_HINT;
  }

  return MAIN_ROUND_EASY_HINT;
}

export function createPracticeRoundHint(matchMode: MatchMode) {
  if (matchMode === MatchMode.Hard) {
    return PRACTICE_ROUND_HARD_HINT;
  }

  return PRACTICE_ROUND_EASY_HINT;
}

export function createTimedRoundPhaseLabel(timedRoundPhase: TimedRoundPhase) {
  return `${timedRoundPhase}/3`;
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

export function getFinalBatchCountdown(
  completedMatchCount: number,
  timedRoundPhase: TimedRoundPhase,
) {
  const remainingMatchCount = CHALLENGE_STAGE_MATCH_GOAL - completedMatchCount;
  const boardSize = getTimedRoundBoardSize(timedRoundPhase);

  if (remainingMatchCount > 0 && remainingMatchCount <= boardSize) {
    return remainingMatchCount;
  }

  return null;
}

export function getNextTimedRoundPhase(timedRoundPhase: TimedRoundPhase) {
  if (timedRoundPhase === TimedRoundPhase.FourCards) {
    return TimedRoundPhase.FiveCards;
  } else if (timedRoundPhase === TimedRoundPhase.FiveCards) {
    return TimedRoundPhase.SixCards;
  } else {
    return null;
  }
}

export function isChallengeTimed(session: GameSession | null) {
  return session?.focusMode === FocusMode.Timed;
}

export function getChallengeStageDurationSeconds() {
  return STANDARD_CHALLENGE_STAGE_SECONDS;
}

export function shouldShuffleWordColumn(matchMode: MatchMode | undefined) {
  return matchMode === MatchMode.Hard;
}

export function arrangeWordBoardAfterReplacement(
  gameBoard: GameBoardPair[],
  replacementBoardPairId: string,
  replacedBoardPairIndex: number,
  matchMode: MatchMode | undefined,
) {
  if (shouldShuffleWordColumn(matchMode)) {
    return shuffleGameBoardAfterReplacement(
      gameBoard,
      replacementBoardPairId,
      replacedBoardPairIndex,
    );
  }

  return gameBoard;
}

export function arrangeRemainingWordBoard(
  gameBoard: GameBoardPair[],
  matchMode: MatchMode | undefined,
) {
  if (shouldShuffleWordColumn(matchMode)) {
    return shuffle(gameBoard);
  }

  return gameBoard;
}

export function createReinforcementAnswerChoices(
  targetWordPair: WordPair,
  wordPairs: WordPair[],
  choiceCount: number,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  const distractorChoices = shuffle(
    wordPairs.filter((wordPair) => wordPair.id !== targetWordPair.id),
    generateRandomNumber,
  )
    .slice(0, Math.max(choiceCount - 1, 0))
    .map<ReinforcementAnswerChoice>((wordPair) => ({
      wordPairId: wordPair.id,
      translation: wordPair.translation,
    }));
  const correctChoice: ReinforcementAnswerChoice = {
    wordPairId: targetWordPair.id,
    translation: targetWordPair.translation,
  };

  return shuffle([correctChoice, ...distractorChoices], generateRandomNumber);
}

export function reshuffleReinforcementAnswerChoices(
  answerChoices: ReinforcementAnswerChoice[],
  correctWordPairId: string,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  const previousCorrectChoiceIndex = answerChoices.findIndex(
    (answerChoice) => answerChoice.wordPairId === correctWordPairId,
  );
  const shuffledAnswerChoices = shuffle(answerChoices, generateRandomNumber);
  const nextCorrectChoiceIndex = shuffledAnswerChoices.findIndex(
    (answerChoice) => answerChoice.wordPairId === correctWordPairId,
  );

  if (
    shuffledAnswerChoices.length <= 1 ||
    previousCorrectChoiceIndex < 0 ||
    nextCorrectChoiceIndex !== previousCorrectChoiceIndex
  ) {
    return shuffledAnswerChoices;
  }

  const swapChoiceIndex =
    nextCorrectChoiceIndex === shuffledAnswerChoices.length - 1 ? 0 : nextCorrectChoiceIndex + 1;
  const correctChoice = shuffledAnswerChoices[nextCorrectChoiceIndex];

  shuffledAnswerChoices[nextCorrectChoiceIndex] = shuffledAnswerChoices[swapChoiceIndex];
  shuffledAnswerChoices[swapChoiceIndex] = correctChoice;

  return shuffledAnswerChoices;
}

export function advanceReinforcementRepetition(
  currentCorrectRepetitionCount: number,
  repetitionGoal: number,
) {
  const nextCorrectRepetitionCount = Math.min(currentCorrectRepetitionCount + 1, repetitionGoal);

  return {
    nextCorrectRepetitionCount,
    isWordComplete: nextCorrectRepetitionCount >= repetitionGoal,
  };
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
  completedWordPairIds: string[],
) {
  if (difficultWordPairs.length === 0 || nextPracticePairIndex >= difficultWordPairs.length) {
    return null;
  }

  const completedWordPairIdSet = new Set(completedWordPairIds);
  const visibleWordPairIds = new Set(
    remainingGameBoard.map((gameBoardPair) => gameBoardPair.wordPairId),
  );

  for (
    let candidateSequenceIndex = nextPracticePairIndex;
    candidateSequenceIndex < difficultWordPairs.length;
    candidateSequenceIndex += 1
  ) {
    const candidateWordPair = difficultWordPairs[candidateSequenceIndex];

    if (
      !completedWordPairIdSet.has(candidateWordPair.id) &&
      !visibleWordPairIds.has(candidateWordPair.id)
    ) {
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

export function createSequentialGameBoard(
  wordPairs: WordPair[],
  boardSize: number,
  boardPairIdPrefix: string,
  startingSequenceIndex: number,
) {
  if (wordPairs.length === 0) {
    return [];
  }

  return Array.from({ length: boardSize }, (_, boardPairOffset) => {
    const sequenceIndex = startingSequenceIndex + boardPairOffset;
    const wordPair = wordPairs[sequenceIndex % wordPairs.length];

    return createGameBoardPair(wordPair, boardPairIdPrefix, sequenceIndex);
  });
}

export function replaceGameBoardPair(
  gameBoard: GameBoardPair[],
  matchedBoardPairId: string,
  replacementBoardPair: GameBoardPair,
) {
  return gameBoard.map((gameBoardPair) => {
    if (gameBoardPair.boardPairId === matchedBoardPairId) {
      return replacementBoardPair;
    }

    return gameBoardPair;
  });
}

export function createInitialMismatchStatistics(wordPairs: WordPair[]) {
  return wordPairs.map<WordPairMismatchStatistics>((wordPair) => ({
    wordPairId: wordPair.id,
    mismatchCount: 0,
  }));
}

export function createInitialWordAttemptStatistics(wordPairs: WordPair[]) {
  return wordPairs.map<WordAttemptStatistic>((wordPair) => ({
    wordPairId: wordPair.id,
    attemptsByPhase: createEmptyAttemptsByPhase(),
  }));
}

export function createEmptyAttemptsByPhase(): Record<GameAttemptPhase, AttemptCount> {
  return {
    [GameAttemptPhase.GuidedReinforcement]: createEmptyAttemptCount(),
    [GameAttemptPhase.MainChallenge]: createEmptyAttemptCount(),
    [GameAttemptPhase.DifficultPractice]: createEmptyAttemptCount(),
    [GameAttemptPhase.FinalQuiz]: createEmptyAttemptCount(),
    [GameAttemptPhase.FocusedReviewPractice]: createEmptyAttemptCount(),
    [GameAttemptPhase.FocusedReviewQuiz]: createEmptyAttemptCount(),
  };
}

function createEmptyAttemptCount(): AttemptCount {
  return { correctAttemptCount: 0, incorrectAttemptCount: 0 };
}

export function incrementWordCorrectAttempt(
  wordAttemptStatistics: WordAttemptStatistic[],
  wordPairId: string,
  phase: GameAttemptPhase,
) {
  return wordAttemptStatistics.map((wordStatistic) => {
    if (wordStatistic.wordPairId === wordPairId) {
      const phaseAttempts = wordStatistic.attemptsByPhase[phase];

      return {
        ...wordStatistic,
        attemptsByPhase: {
          ...wordStatistic.attemptsByPhase,
          [phase]: {
            ...phaseAttempts,
            correctAttemptCount: phaseAttempts.correctAttemptCount + 1,
          },
        },
      };
    }

    return wordStatistic;
  });
}

export function incrementWordIncorrectAttempt(
  wordAttemptStatistics: WordAttemptStatistic[],
  wordPairId: string,
  phase: GameAttemptPhase,
) {
  return wordAttemptStatistics.map((wordStatistic) => {
    if (wordStatistic.wordPairId === wordPairId) {
      const phaseAttempts = wordStatistic.attemptsByPhase[phase];

      return {
        ...wordStatistic,
        attemptsByPhase: {
          ...wordStatistic.attemptsByPhase,
          [phase]: {
            ...phaseAttempts,
            incorrectAttemptCount: phaseAttempts.incorrectAttemptCount + 1,
          },
        },
      };
    }

    return wordStatistic;
  });
}

export function createCompletedWordStatistics(wordAttemptStatistics: WordAttemptStatistic[]) {
  return wordAttemptStatistics.map<CompletedWordStatistic>((wordStatistic) => {
    const phaseAttempts = Object.values(wordStatistic.attemptsByPhase);
    const correctAttemptCount = phaseAttempts.reduce(
      (total, attemptCount) => total + attemptCount.correctAttemptCount,
      0,
    );
    const incorrectAttemptCount = phaseAttempts.reduce(
      (total, attemptCount) => total + attemptCount.incorrectAttemptCount,
      0,
    );
    const totalAttemptCount = correctAttemptCount + incorrectAttemptCount;
    const accuracy =
      totalAttemptCount > 0 ? Math.round((correctAttemptCount / totalAttemptCount) * 100) : 0;

    return {
      wordPairId: wordStatistic.wordPairId,
      correctAttemptCount,
      totalAttemptCount,
      accuracy,
    };
  });
}

export function createCompletedAssessmentStatistics(
  wordAttemptStatistics: WordAttemptStatistic[],
  assessmentPhases: GameAttemptPhase[],
) {
  return wordAttemptStatistics.map<CompletedAssessmentStatistic>((wordStatistic) => {
    const phaseAttempts = assessmentPhases.map(
      (assessmentPhase) => wordStatistic.attemptsByPhase[assessmentPhase],
    );
    const correctAttemptCount = phaseAttempts.reduce(
      (total, attemptCount) => total + attemptCount.correctAttemptCount,
      0,
    );
    const incorrectAttemptCount = phaseAttempts.reduce(
      (total, attemptCount) => total + attemptCount.incorrectAttemptCount,
      0,
    );
    const totalAttemptCount = correctAttemptCount + incorrectAttemptCount;

    return {
      wordPairId: wordStatistic.wordPairId,
      correctAttemptCount,
      totalAttemptCount,
      accuracy:
        totalAttemptCount > 0 ? Math.round((correctAttemptCount / totalAttemptCount) * 100) : 0,
    };
  });
}

export function selectMissedWordPairIds(wordAttemptStatistics: WordAttemptStatistic[]) {
  return wordAttemptStatistics.flatMap((wordStatistic) => {
    const hasIncorrectAttempt = Object.values(wordStatistic.attemptsByPhase).some(
      (attemptCount) => attemptCount.incorrectAttemptCount > 0,
    );

    return hasIncorrectAttempt ? [wordStatistic.wordPairId] : [];
  });
}

export function createCompletedGameResult(
  savedDeckId: string,
  wordPairs: WordPair[],
  learningStatistics: WordPairLearningStatistics[],
  wordAttemptStatistics: WordAttemptStatistic[],
  wordMasteries: WordMastery[],
  completedAt: number,
): CompletedGameResult {
  const completedWordStatistics = createCompletedWordStatistics(wordAttemptStatistics);
  const assessmentStatistics = createCompletedAssessmentStatistics(wordAttemptStatistics, [
    GameAttemptPhase.MainChallenge,
    GameAttemptPhase.FinalQuiz,
  ]);
  const missedWordPairIds = selectMissedWordPairIds(wordAttemptStatistics);
  const completedStatisticsByWordPairId = new Map(
    completedWordStatistics.map((statistic) => [statistic.wordPairId, statistic]),
  );
  const assessmentStatisticsByWordPairId = new Map(
    assessmentStatistics.map((statistic) => [statistic.wordPairId, statistic]),
  );
  const masteryByWordPairId = new Map(
    wordMasteries
      .filter((mastery) => mastery.savedDeckId === savedDeckId)
      .map((mastery) => [mastery.wordPairId, mastery]),
  );
  const assessmentCorrectAttemptCount = assessmentStatistics.reduce(
    (total, statistic) => total + statistic.correctAttemptCount,
    0,
  );
  const assessmentTotalAttemptCount = assessmentStatistics.reduce(
    (total, statistic) => total + statistic.totalAttemptCount,
    0,
  );

  return {
    completedAt,
    assessmentAccuracy:
      assessmentTotalAttemptCount > 0
        ? Math.round((assessmentCorrectAttemptCount / assessmentTotalAttemptCount) * 100)
        : 0,
    assessmentCorrectAttemptCount,
    assessmentIncorrectAttemptCount: assessmentTotalAttemptCount - assessmentCorrectAttemptCount,
    totalIncorrectAttemptCount: completedWordStatistics.reduce(
      (total, statistic) => total + statistic.totalAttemptCount - statistic.correctAttemptCount,
      0,
    ),
    missedWordPairIds,
    completedWordStatistics,
    assessmentStatistics,
    learningStatistics,
    wordResults: wordPairs.map((wordPair) => {
      const completedStatistic = completedStatisticsByWordPairId.get(wordPair.id);
      const assessmentStatistic = assessmentStatisticsByWordPairId.get(wordPair.id) ?? {
        wordPairId: wordPair.id,
        correctAttemptCount: 0,
        totalAttemptCount: 0,
        accuracy: 0,
      };
      const masteryBefore =
        masteryByWordPairId.get(wordPair.id) ?? createNewWordMastery(savedDeckId, wordPair.id);

      return {
        wordPair,
        correctAttemptCount: completedStatistic?.correctAttemptCount ?? 0,
        incorrectAttemptCount: completedStatistic
          ? completedStatistic.totalAttemptCount - completedStatistic.correctAttemptCount
          : 0,
        assessmentCorrectAttemptCount: assessmentStatistic.correctAttemptCount,
        assessmentIncorrectAttemptCount:
          assessmentStatistic.totalAttemptCount - assessmentStatistic.correctAttemptCount,
        assessmentAccuracy: assessmentStatistic.accuracy,
        masteryBefore,
        masteryAfter: applyAssessmentToWordMastery(masteryBefore, assessmentStatistic, completedAt),
      };
    }),
  };
}

export function applyFocusedReviewToGameResult(
  result: CompletedGameResult,
  reviewAssessmentStatistics: CompletedAssessmentStatistic[],
  completedAt: number,
) {
  const reviewStatisticByWordPairId = new Map(
    reviewAssessmentStatistics.map((statistic) => [statistic.wordPairId, statistic]),
  );

  return {
    ...result,
    wordResults: result.wordResults.map((wordResult) => {
      const reviewStatistic = reviewStatisticByWordPairId.get(wordResult.wordPair.id);

      if (!reviewStatistic || reviewStatistic.totalAttemptCount === 0) {
        return wordResult;
      }

      return {
        ...wordResult,
        masteryAfter: applyAssessmentToWordMastery(
          wordResult.masteryAfter,
          reviewStatistic,
          completedAt,
        ),
      };
    }),
  };
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

export function createFocusedReviewWordPairs(
  wordPairs: WordPair[],
  missedWordPairIds: Set<string>,
  minimumWordPairCount: number,
  generateRandomNumber: RandomNumberGenerator = Math.random,
) {
  const missedWordPairs = wordPairs.filter((wordPair) => missedWordPairIds.has(wordPair.id));

  if (missedWordPairs.length === 0 || missedWordPairs.length >= minimumWordPairCount) {
    return missedWordPairs;
  }

  const additionalWordPairCount = Math.min(
    minimumWordPairCount - missedWordPairs.length,
    wordPairs.length - missedWordPairs.length,
  );
  const additionalWordPairs = shuffle(
    wordPairs.filter((wordPair) => !missedWordPairIds.has(wordPair.id)),
    generateRandomNumber,
  ).slice(0, additionalWordPairCount);

  return [...missedWordPairs, ...additionalWordPairs];
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
