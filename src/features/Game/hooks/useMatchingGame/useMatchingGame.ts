import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation } from 'react-native';

import { FocusMode, GameSession, WordPair } from '@/features/GameSession/types';

import {
  DIFFICULT_WORD_PAIR_COUNT,
  FINAL_QUIZ_CHOICE_COUNT,
  FINAL_QUIZ_CORRECT_FEEDBACK_DURATION_MS,
  FINAL_QUIZ_MISS_FEEDBACK_DURATION_MS,
  INCORRECT_FEEDBACK_DURATION_MS,
  MAIN_BOARD_PAIR_ID_PREFIX,
  MATCH_FEEDBACK_DURATION_MS,
  MATCH_GOAL,
  MILLISECONDS_PER_SECOND,
  PRACTICE_BOARD_SIZE,
  PRACTICE_BOARD_PAIR_ID_PREFIX,
  TIMED_ROUND_SECONDS,
} from '../../constants';
import {
  FinalQuizAnswerChoice,
  FinalQuizFeedback,
  GameStage,
  MatchFeedback,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairMismatchStatistics,
} from '../../types';
import {
  createGameBoardPair,
  createEmptySelectedBoardPair,
  createFinalQuizAnswerChoices,
  createInitialGameBoard,
  createInitialMismatchStatistics,
  createLearningStatistics,
  createShuffledFinalQuizWordPairs,
  findGameBoardPair,
  getInitialMainRoundBoardSize,
  getTimedRoundBoardSize,
  getTimedRoundPhase,
  haveMatchingTranslations,
  incrementWordPairMismatchCount,
  isMatchingGameStage,
  selectDifficultWordPairs,
  selectNextUniquePracticeWordPair,
  shuffle,
  shuffleGameBoardAfterReplacement,
} from '../../utils';
import { UseMatchingGameResult } from './types';

export function useMatchingGame(session: GameSession | null): UseMatchingGameResult {
  const isTimedMainRound = session?.focusMode === FocusMode.Timed;
  const initialMainRoundBoardSize = getInitialMainRoundBoardSize(isTimedMainRound);
  const [gameStage, setGameStage] = useState(GameStage.MainRound);
  const [gameBoard, setGameBoard] = useState(() =>
    createInitialGameBoard(
      session?.pairs ?? [],
      initialMainRoundBoardSize,
      MAIN_BOARD_PAIR_ID_PREFIX,
    ),
  );
  const [nextMainRoundPairIndex, setNextMainRoundPairIndex] = useState(initialMainRoundBoardSize);
  const [selectedBoardPair, setSelectedBoardPair] = useState(createEmptySelectedBoardPair);
  const [matchFeedback, setMatchFeedback] = useState(MatchFeedback.None);
  const [mainRoundScore, setMainRoundScore] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(TIMED_ROUND_SECONDS);
  const [timedRoundPhase, setTimedRoundPhase] = useState(TimedRoundPhase.FourCards);
  const [timedRoundTransitionPhase, setTimedRoundTransitionPhase] =
    useState<TimedRoundPhase | null>(null);
  const [mismatchStatistics, setMismatchStatistics] = useState<WordPairMismatchStatistics[]>(() =>
    createInitialMismatchStatistics(session?.pairs ?? []),
  );
  const [difficultWordPairs, setDifficultWordPairs] = useState<WordPair[]>([]);
  const [nextPracticePairIndex, setNextPracticePairIndex] = useState(PRACTICE_BOARD_SIZE);
  const [completedPracticeWordPairIds, setCompletedPracticeWordPairIds] = useState<string[]>([]);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [finalQuizWordPairs, setFinalQuizWordPairs] = useState<WordPair[]>([]);
  const [currentFinalQuizQuestionIndex, setCurrentFinalQuizQuestionIndex] = useState(0);
  const [finalQuizAnswerChoices, setFinalQuizAnswerChoices] = useState<FinalQuizAnswerChoice[]>([]);
  const [finalQuizFeedback, setFinalQuizFeedback] = useState(FinalQuizFeedback.None);
  const [selectedFinalQuizAnswerId, setSelectedFinalQuizAnswerId] = useState<string | null>(null);
  const finalQuizFeedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translationBoardPairs = useMemo(() => shuffle(gameBoard), [gameBoard]);
  const practicedWordPairIds = useMemo(
    () => new Set(difficultWordPairs.map((wordPair) => wordPair.id)),
    [difficultWordPairs],
  );
  const learningStatistics = useMemo(
    () => createLearningStatistics(session?.pairs ?? [], mismatchStatistics, practicedWordPairIds),
    [mismatchStatistics, practicedWordPairIds, session?.pairs],
  );
  const detectedTimedRoundPhase = getTimedRoundPhase(secondsRemaining);
  const mainRoundProgress = isTimedMainRound
    ? Math.min((TIMED_ROUND_SECONDS - secondsRemaining) / TIMED_ROUND_SECONDS, 1)
    : Math.min(mainRoundScore / MATCH_GOAL, 1);
  const practicePairCount = difficultWordPairs.length;
  const completedPracticePairCount = completedPracticeWordPairIds.length;
  const practiceRoundProgress =
    practicePairCount > 0 ? completedPracticePairCount / practicePairCount : 0;
  const currentFinalQuizQuestion = finalQuizWordPairs[currentFinalQuizQuestionIndex] ?? null;
  const passedFinalQuizWordPairCount = currentFinalQuizQuestionIndex;
  const finalQuizWordPairCount = finalQuizWordPairs.length;

  useEffect(() => {
    if (gameStage !== GameStage.MainRound || !isTimedMainRound) {
      return;
    }

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((currentSecondsRemaining) => Math.max(0, currentSecondsRemaining - 1));
    }, MILLISECONDS_PER_SECOND);

    return () => clearInterval(countdownInterval);
  }, [gameStage, isTimedMainRound]);

  useEffect(() => {
    if (
      gameStage !== GameStage.MainRound ||
      !isTimedMainRound ||
      matchFeedback !== MatchFeedback.None ||
      detectedTimedRoundPhase <= timedRoundPhase
    ) {
      return;
    }

    setSelectedBoardPair(createEmptySelectedBoardPair());
    setTimedRoundTransitionPhase(detectedTimedRoundPhase);
    setGameStage(GameStage.TimedRoundTransition);
  }, [detectedTimedRoundPhase, gameStage, isTimedMainRound, matchFeedback, timedRoundPhase]);

  useEffect(() => {
    if (
      !session ||
      session.pairs.length === 0 ||
      gameStage !== GameStage.MainRound ||
      !isTimedMainRound ||
      matchFeedback !== MatchFeedback.None
    ) {
      return;
    }

    const targetBoardSize = getTimedRoundBoardSize(timedRoundPhase);
    const missingBoardPairCount = targetBoardSize - gameBoard.length;

    if (missingBoardPairCount <= 0) {
      return;
    }

    const expansionBoardPairs = Array.from(
      { length: missingBoardPairCount },
      (_, expansionPairIndex) => {
        const sequenceIndex = nextMainRoundPairIndex + expansionPairIndex;
        const wordPair = session.pairs[sequenceIndex % session.pairs.length];

        return createGameBoardPair(wordPair, MAIN_BOARD_PAIR_ID_PREFIX, sequenceIndex);
      },
    );
    const expandedGameBoard = [...gameBoard, ...expansionBoardPairs];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setGameBoard(shuffle(expandedGameBoard));
    setNextMainRoundPairIndex((currentPairIndex) => currentPairIndex + missingBoardPairCount);
  }, [
    gameBoard,
    gameStage,
    isTimedMainRound,
    matchFeedback,
    nextMainRoundPairIndex,
    session,
    timedRoundPhase,
  ]);

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }

      if (finalQuizFeedbackTimeout.current) {
        clearTimeout(finalQuizFeedbackTimeout.current);
      }
    };
  }, []);

  const advanceMainRoundAfterCorrectMatch = useCallback(
    (matchedBoardPairId: string) => {
      if (!session || session.pairs.length === 0) {
        return;
      }

      const nextWordPair = session.pairs[nextMainRoundPairIndex % session.pairs.length];
      const nextGameBoardPair = createGameBoardPair(
        nextWordPair,
        MAIN_BOARD_PAIR_ID_PREFIX,
        nextMainRoundPairIndex,
      );

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setGameBoard((currentGameBoard) => {
        const replacedBoardPairIndex = currentGameBoard.findIndex(
          (gameBoardPair) => gameBoardPair.boardPairId === matchedBoardPairId,
        );
        const advancedGameBoard = currentGameBoard.map((gameBoardPair) => {
          if (gameBoardPair.boardPairId === matchedBoardPairId) {
            return nextGameBoardPair;
          }

          return gameBoardPair;
        });

        return shuffleGameBoardAfterReplacement(
          advancedGameBoard,
          nextGameBoardPair.boardPairId,
          replacedBoardPairIndex,
        );
      });
      setNextMainRoundPairIndex((currentPairIndex) => currentPairIndex + 1);
      setMainRoundScore((currentScore) => currentScore + 1);
    },
    [nextMainRoundPairIndex, session],
  );

  const advancePracticeRoundAfterCorrectMatch = useCallback(
    (matchedGameBoardPairId: string, matchedWordPairId: string) => {
      const remainingGameBoard = gameBoard.filter(
        (gameBoardPair) => gameBoardPair.boardPairId !== matchedGameBoardPairId,
      );
      const replacedBoardPairIndex = gameBoard.findIndex(
        (gameBoardPair) => gameBoardPair.boardPairId === matchedGameBoardPairId,
      );
      const practiceReplacement = selectNextUniquePracticeWordPair(
        difficultWordPairs,
        remainingGameBoard,
        nextPracticePairIndex,
      );
      const recycledGameBoard = [...remainingGameBoard];

      if (practiceReplacement) {
        recycledGameBoard.push(
          createGameBoardPair(
            practiceReplacement.wordPair,
            PRACTICE_BOARD_PAIR_ID_PREFIX,
            practiceReplacement.sequenceIndex,
          ),
        );
        setNextPracticePairIndex(practiceReplacement.nextPairIndex);
      }

      setCompletedPracticeWordPairIds((currentCompletedWordPairIds) => {
        if (currentCompletedWordPairIds.includes(matchedWordPairId)) {
          return currentCompletedWordPairIds;
        }

        return [...currentCompletedWordPairIds, matchedWordPairId];
      });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      if (practiceReplacement) {
        const replacementBoardPair = recycledGameBoard[recycledGameBoard.length - 1];

        setGameBoard(
          shuffleGameBoardAfterReplacement(
            recycledGameBoard,
            replacementBoardPair.boardPairId,
            replacedBoardPairIndex,
          ),
        );
      } else {
        setGameBoard(shuffle(recycledGameBoard));
      }
    },
    [difficultWordPairs, gameBoard, nextPracticePairIndex],
  );

  const evaluateCompletedSelection = useCallback(
    (completedSelection: SelectedBoardPair) => {
      if (!completedSelection.wordBoardPairId || !completedSelection.translationBoardPairId) {
        return;
      }

      const selectedWordGameBoardPair = findGameBoardPair(
        gameBoard,
        completedSelection.wordBoardPairId,
      );
      const selectedTranslationGameBoardPair = findGameBoardPair(
        gameBoard,
        completedSelection.translationBoardPairId,
      );

      if (!selectedWordGameBoardPair || !selectedTranslationGameBoardPair) {
        setSelectedBoardPair(createEmptySelectedBoardPair());

        return;
      }

      const isCorrectMatch = haveMatchingTranslations(
        selectedWordGameBoardPair,
        selectedTranslationGameBoardPair,
      );

      if (isCorrectMatch) {
        setMatchFeedback(MatchFeedback.Correct);
      } else {
        setMatchFeedback(MatchFeedback.Incorrect);
        setMismatchStatistics((currentMismatchStatistics) =>
          incrementWordPairMismatchCount(
            currentMismatchStatistics,
            selectedWordGameBoardPair.wordPairId,
          ),
        );
      }

      const feedbackDuration = isCorrectMatch
        ? MATCH_FEEDBACK_DURATION_MS
        : INCORRECT_FEEDBACK_DURATION_MS;

      feedbackTimeout.current = setTimeout(() => {
        if (isCorrectMatch && gameStage === GameStage.MainRound) {
          advanceMainRoundAfterCorrectMatch(selectedWordGameBoardPair.boardPairId);
        } else if (isCorrectMatch && gameStage === GameStage.DifficultWordsPractice) {
          advancePracticeRoundAfterCorrectMatch(
            selectedWordGameBoardPair.boardPairId,
            selectedWordGameBoardPair.wordPairId,
          );
        }

        setSelectedBoardPair(createEmptySelectedBoardPair());
        setMatchFeedback(MatchFeedback.None);
        feedbackTimeout.current = null;
      }, feedbackDuration);
    },
    [
      advanceMainRoundAfterCorrectMatch,
      advancePracticeRoundAfterCorrectMatch,
      gameBoard,
      gameStage,
    ],
  );

  const selectWordCard = useCallback(
    (boardPairId: string) => {
      if (!isMatchingGameStage(gameStage) || matchFeedback !== MatchFeedback.None) {
        return;
      }

      if (selectedBoardPair.wordBoardPairId && selectedBoardPair.translationBoardPairId) {
        return;
      }

      const nextSelectedBoardPair = {
        ...selectedBoardPair,
        wordBoardPairId: boardPairId,
      };

      setSelectedBoardPair(nextSelectedBoardPair);
      evaluateCompletedSelection(nextSelectedBoardPair);
    },
    [evaluateCompletedSelection, gameStage, matchFeedback, selectedBoardPair],
  );

  const selectTranslationCard = useCallback(
    (boardPairId: string) => {
      if (!isMatchingGameStage(gameStage) || matchFeedback !== MatchFeedback.None) {
        return;
      }

      if (selectedBoardPair.wordBoardPairId && selectedBoardPair.translationBoardPairId) {
        return;
      }

      const nextSelectedBoardPair = {
        ...selectedBoardPair,
        translationBoardPairId: boardPairId,
      };

      setSelectedBoardPair(nextSelectedBoardPair);
      evaluateCompletedSelection(nextSelectedBoardPair);
    },
    [evaluateCompletedSelection, gameStage, matchFeedback, selectedBoardPair],
  );

  const completeMainRound = useCallback(() => {
    if (!session) {
      return;
    }

    const selectedDifficultWordPairs = selectDifficultWordPairs(
      session.pairs,
      mismatchStatistics,
      DIFFICULT_WORD_PAIR_COUNT,
    );

    setDifficultWordPairs(selectedDifficultWordPairs);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setGameStage(GameStage.PracticeTransition);
  }, [mismatchStatistics, session]);

  const continueTimedRound = useCallback(() => {
    if (!timedRoundTransitionPhase) {
      return;
    }

    setTimedRoundPhase(timedRoundTransitionPhase);
    setTimedRoundTransitionPhase(null);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setMatchFeedback(MatchFeedback.None);
    setGameStage(GameStage.MainRound);
  }, [timedRoundTransitionPhase]);

  useEffect(() => {
    if (gameStage !== GameStage.MainRound || matchFeedback !== MatchFeedback.None) {
      return;
    }

    const reachedPracticeModeMatchGoal = !isTimedMainRound && mainRoundScore >= MATCH_GOAL;
    const timedRoundExpired = isTimedMainRound && secondsRemaining === 0;

    if (reachedPracticeModeMatchGoal || timedRoundExpired) {
      completeMainRound();
    }
  }, [
    completeMainRound,
    gameStage,
    isTimedMainRound,
    mainRoundScore,
    matchFeedback,
    secondsRemaining,
  ]);

  const startFinalQuiz = useCallback(() => {
    if (difficultWordPairs.length === 0) {
      setGameStage(GameStage.LearningStatistics);

      return;
    }

    const shuffledFinalQuizWordPairs = createShuffledFinalQuizWordPairs(difficultWordPairs);
    const firstFinalQuizQuestion = shuffledFinalQuizWordPairs[0];

    setFinalQuizWordPairs(shuffledFinalQuizWordPairs);
    setCurrentFinalQuizQuestionIndex(0);
    setFinalQuizAnswerChoices(
      createFinalQuizAnswerChoices(
        firstFinalQuizQuestion,
        session?.pairs ?? difficultWordPairs,
        FINAL_QUIZ_CHOICE_COUNT,
      ),
    );
    setFinalQuizFeedback(FinalQuizFeedback.None);
    setSelectedFinalQuizAnswerId(null);
    setGameStage(GameStage.FinalQuiz);
  }, [difficultWordPairs, session?.pairs]);

  useEffect(() => {
    const completedEveryPracticePair =
      practicePairCount > 0 && completedPracticePairCount >= practicePairCount;

    if (
      gameStage === GameStage.DifficultWordsPractice &&
      matchFeedback === MatchFeedback.None &&
      completedEveryPracticePair
    ) {
      setGameStage(GameStage.FinalQuizTransition);
    }
  }, [completedPracticePairCount, gameStage, matchFeedback, practicePairCount]);

  const selectFinalQuizAnswer = useCallback(
    (selectedWordPairId: string) => {
      if (
        gameStage !== GameStage.FinalQuiz ||
        finalQuizFeedback !== FinalQuizFeedback.None ||
        !currentFinalQuizQuestion
      ) {
        return;
      }

      const isCorrectAnswer = selectedWordPairId === currentFinalQuizQuestion.id;

      setSelectedFinalQuizAnswerId(selectedWordPairId);

      if (!isCorrectAnswer) {
        setMismatchStatistics((currentMismatchStatistics) =>
          incrementWordPairMismatchCount(currentMismatchStatistics, currentFinalQuizQuestion.id),
        );
        setFinalQuizFeedback(FinalQuizFeedback.Miss);
        finalQuizFeedbackTimeout.current = setTimeout(() => {
          setFinalQuizFeedback(FinalQuizFeedback.None);
          setSelectedFinalQuizAnswerId(null);
          finalQuizFeedbackTimeout.current = null;
        }, FINAL_QUIZ_MISS_FEEDBACK_DURATION_MS);

        return;
      }

      setFinalQuizFeedback(FinalQuizFeedback.Correct);
      finalQuizFeedbackTimeout.current = setTimeout(() => {
        const nextFinalQuizQuestionIndex = currentFinalQuizQuestionIndex + 1;
        const nextFinalQuizQuestion = finalQuizWordPairs[nextFinalQuizQuestionIndex];

        setCurrentFinalQuizQuestionIndex(nextFinalQuizQuestionIndex);

        if (!nextFinalQuizQuestion) {
          setFinalQuizFeedback(FinalQuizFeedback.None);
          setSelectedFinalQuizAnswerId(null);
          setGameStage(GameStage.LearningStatistics);
          finalQuizFeedbackTimeout.current = null;

          return;
        }

        setFinalQuizAnswerChoices(
          createFinalQuizAnswerChoices(
            nextFinalQuizQuestion,
            session?.pairs ?? difficultWordPairs,
            FINAL_QUIZ_CHOICE_COUNT,
          ),
        );
        setFinalQuizFeedback(FinalQuizFeedback.None);
        setSelectedFinalQuizAnswerId(null);
        finalQuizFeedbackTimeout.current = null;
      }, FINAL_QUIZ_CORRECT_FEEDBACK_DURATION_MS);
    },
    [
      currentFinalQuizQuestion,
      currentFinalQuizQuestionIndex,
      difficultWordPairs,
      finalQuizFeedback,
      finalQuizWordPairs,
      gameStage,
      session?.pairs,
    ],
  );

  const startDifficultWordsPractice = useCallback(() => {
    if (difficultWordPairs.length === 0) {
      setGameStage(GameStage.LearningStatistics);

      return;
    }

    setGameBoard(
      createInitialGameBoard(
        difficultWordPairs,
        PRACTICE_BOARD_SIZE,
        PRACTICE_BOARD_PAIR_ID_PREFIX,
      ),
    );
    setNextPracticePairIndex(Math.min(PRACTICE_BOARD_SIZE, difficultWordPairs.length));
    setCompletedPracticeWordPairIds([]);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setMatchFeedback(MatchFeedback.None);
    setGameStage(GameStage.DifficultWordsPractice);
  }, [difficultWordPairs]);

  return {
    gameStage,
    gameBoard,
    translationBoardPairs,
    selectedBoardPair,
    matchFeedback,
    secondsRemaining,
    mainRoundScore,
    mainRoundProgress,
    practiceRoundProgress,
    completedPracticePairCount,
    practicePairCount,
    isTimedMainRound,
    timedRoundPhase,
    timedRoundTransitionPhase,
    learningStatistics,
    currentFinalQuizQuestion,
    finalQuizAnswerChoices,
    finalQuizFeedback,
    selectedFinalQuizAnswerId,
    passedFinalQuizWordPairCount,
    finalQuizWordPairCount,
    selectWordCard,
    selectTranslationCard,
    selectFinalQuizAnswer,
    startDifficultWordsPractice,
    startFinalQuiz,
    continueTimedRound,
  };
}
