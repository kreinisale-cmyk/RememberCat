import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation } from 'react-native';

import { GameSession, MatchMode, WordPair } from '@/features/GameSession/types';

import {
  CHALLENGE_STAGE_MATCH_GOAL,
  DIFFICULT_WORD_PAIR_COUNT,
  EASY_REINFORCEMENT_CHOICE_COUNT,
  EASY_REINFORCEMENT_CORRECT_FEEDBACK_DURATION_MS,
  EASY_REINFORCEMENT_INCORRECT_FEEDBACK_DURATION_MS,
  EASY_REINFORCEMENT_REPETITION_GOAL,
  FINAL_QUIZ_CHOICE_COUNT,
  FINAL_QUIZ_CORRECT_FEEDBACK_DURATION_MS,
  FINAL_QUIZ_MISS_FEEDBACK_DURATION_MS,
  INCORRECT_FEEDBACK_DURATION_MS,
  LEARNED_WORD_CELEBRATION_DURATION_MS,
  MAIN_BOARD_PAIR_ID_PREFIX,
  MATCH_FEEDBACK_DURATION_MS,
  MILLISECONDS_PER_SECOND,
  PRACTICE_BOARD_SIZE,
  PRACTICE_BOARD_PAIR_ID_PREFIX,
  TIMED_ROUND_FIRST_BOARD_SIZE,
} from '../../constants';
import {
  FinalQuizAnswerChoice,
  FinalQuizFeedback,
  GameStage,
  MatchCelebrationAnimation,
  MatchFeedback,
  ReinforcementAnswerChoice,
  ReinforcementFeedback,
  SelectedBoardPair,
  TimedRoundPhase,
  WordPairMismatchStatistics,
} from '../../types';
import {
  advanceReinforcementRepetition,
  arrangeRemainingWordBoard,
  arrangeWordBoardAfterReplacement,
  createEmptySelectedBoardPair,
  createCompletedWordStatistics,
  createFinalQuizAnswerChoices,
  createGameBoardPair,
  createInitialGameBoard,
  createInitialMismatchStatistics,
  createInitialWordAttemptStatistics,
  createReinforcementAnswerChoices,
  createLearningStatistics,
  createSequentialGameBoard,
  createShuffledFinalQuizWordPairs,
  findGameBoardPair,
  getChallengeStageDurationSeconds,
  getFinalBatchCountdown,
  getNextTimedRoundPhase,
  getTimedRoundBoardSize,
  haveMatchingTranslations,
  incrementWordPairMismatchCount,
  incrementWordCorrectAttempt,
  incrementWordIncorrectAttempt,
  isChallengeTimed,
  isMatchingGameStage,
  replaceGameBoardPair,
  reshuffleReinforcementAnswerChoices,
  selectDifficultWordPairs,
  selectNextMatchCelebrationAnimation,
  selectNextUniquePracticeWordPair,
  shuffle,
  shuffleGameBoardAfterReplacement,
} from '../../utils';
import { UseMatchingGameResult } from './types';

export function useMatchingGame(session: GameSession | null): UseMatchingGameResult {
  const isTimedMainRound = isChallengeTimed(session);
  const challengeStageDurationSeconds = getChallengeStageDurationSeconds();
  const [gameStage, setGameStage] = useState(GameStage.Preparation);
  const [preparationWordIndex, setPreparationWordIndex] = useState(0);
  const [gameBoard, setGameBoard] = useState(() =>
    createInitialGameBoard(
      session?.pairs ?? [],
      TIMED_ROUND_FIRST_BOARD_SIZE,
      MAIN_BOARD_PAIR_ID_PREFIX,
    ),
  );
  const [translationBoardPairs, setTranslationBoardPairs] = useState(() =>
    shuffle(
      createInitialGameBoard(
        session?.pairs ?? [],
        TIMED_ROUND_FIRST_BOARD_SIZE,
        MAIN_BOARD_PAIR_ID_PREFIX,
      ),
    ),
  );
  const [nextMainRoundPairIndex, setNextMainRoundPairIndex] = useState(
    TIMED_ROUND_FIRST_BOARD_SIZE,
  );
  const [completedWordBoardPairIds, setCompletedWordBoardPairIds] = useState<string[]>([]);
  const [completedTranslationBoardPairIds, setCompletedTranslationBoardPairIds] = useState<
    string[]
  >([]);
  const [selectedBoardPair, setSelectedBoardPair] = useState(createEmptySelectedBoardPair);
  const [matchFeedback, setMatchFeedback] = useState(MatchFeedback.None);
  const [matchCelebrationAnimation, setMatchCelebrationAnimation] =
    useState<MatchCelebrationAnimation | null>(null);
  const [matchCompletionCountdown, setMatchCompletionCountdown] = useState<number | null>(null);
  const [mainRoundScore, setMainRoundScore] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(challengeStageDurationSeconds);
  const [timedRoundPhase, setTimedRoundPhase] = useState(TimedRoundPhase.FourCards);
  const [timedRoundTransitionPhase, setTimedRoundTransitionPhase] =
    useState<TimedRoundPhase | null>(null);
  const [mismatchStatistics, setMismatchStatistics] = useState<WordPairMismatchStatistics[]>(() =>
    createInitialMismatchStatistics(session?.pairs ?? []),
  );
  const [wordAttemptStatistics, setWordAttemptStatistics] = useState(() =>
    createInitialWordAttemptStatistics(session?.pairs ?? []),
  );
  const [reinforcementWordIndex, setReinforcementWordIndex] = useState(0);
  const [reinforcementCorrectRepetitionCount, setReinforcementCorrectRepetitionCount] = useState(0);
  const [reinforcementAnswerChoices, setReinforcementAnswerChoices] = useState<
    ReinforcementAnswerChoice[]
  >([]);
  const [reinforcementFeedback, setReinforcementFeedback] = useState(ReinforcementFeedback.None);
  const [selectedReinforcementAnswerId, setSelectedReinforcementAnswerId] = useState<string | null>(
    null,
  );
  const [isLearnedWordCelebrationVisible, setIsLearnedWordCelebrationVisible] = useState(false);
  const reinforcementFeedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const learnedWordCelebrationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const practicedWordPairIds = useMemo(
    () => new Set(difficultWordPairs.map((wordPair) => wordPair.id)),
    [difficultWordPairs],
  );
  const learningStatistics = useMemo(
    () => createLearningStatistics(session?.pairs ?? [], mismatchStatistics, practicedWordPairIds),
    [mismatchStatistics, practicedWordPairIds, session?.pairs],
  );
  const completedWordStatistics = useMemo(
    () => createCompletedWordStatistics(wordAttemptStatistics),
    [wordAttemptStatistics],
  );
  const currentPreparationWordPair = session?.pairs[preparationWordIndex] ?? null;
  const preparationWordCount = session?.pairs.length ?? 0;
  const currentReinforcementWordPair = session?.pairs[reinforcementWordIndex] ?? null;
  const reinforcementWordCount = session?.pairs.length ?? 0;
  const mainRoundProgress = Math.min(mainRoundScore / CHALLENGE_STAGE_MATCH_GOAL, 1);
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
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }

      if (finalQuizFeedbackTimeout.current) {
        clearTimeout(finalQuizFeedbackTimeout.current);
      }

      if (reinforcementFeedbackTimeout.current) {
        clearTimeout(reinforcementFeedbackTimeout.current);
      }

      if (learnedWordCelebrationTimeout.current) {
        clearTimeout(learnedWordCelebrationTimeout.current);
      }
    };
  }, []);

  const resetChallengeBoard = useCallback(
    (phase: TimedRoundPhase, startingSequenceIndex: number) => {
      if (!session || session.pairs.length === 0) {
        return;
      }

      const boardSize = getTimedRoundBoardSize(phase);
      const nextGameBoard = createSequentialGameBoard(
        session.pairs,
        boardSize,
        MAIN_BOARD_PAIR_ID_PREFIX,
        startingSequenceIndex,
      );

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setGameBoard(nextGameBoard);
      setTranslationBoardPairs(shuffle(nextGameBoard));
      setNextMainRoundPairIndex(startingSequenceIndex + boardSize);
      setCompletedWordBoardPairIds([]);
      setCompletedTranslationBoardPairIds([]);
      setMatchCompletionCountdown(null);
    },
    [session],
  );

  const startMainRound = useCallback(() => {
    resetChallengeBoard(TimedRoundPhase.FourCards, 0);
    setMainRoundScore(0);
    setSecondsRemaining(challengeStageDurationSeconds);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setMatchFeedback(MatchFeedback.None);
    setMatchCompletionCountdown(null);
    setGameStage(GameStage.MainRound);
  }, [challengeStageDurationSeconds, resetChallengeBoard]);

  const startEasyReinforcement = useCallback(() => {
    const firstReinforcementWordPair = session?.pairs[0];

    if (!firstReinforcementWordPair || !session) {
      startMainRound();

      return;
    }

    setReinforcementWordIndex(0);
    setReinforcementCorrectRepetitionCount(0);
    setReinforcementAnswerChoices(
      createReinforcementAnswerChoices(
        firstReinforcementWordPair,
        session.pairs,
        EASY_REINFORCEMENT_CHOICE_COUNT,
      ),
    );
    setReinforcementFeedback(ReinforcementFeedback.None);
    setSelectedReinforcementAnswerId(null);
    setIsLearnedWordCelebrationVisible(false);
    setGameStage(GameStage.EasyReinforcement);
  }, [session, startMainRound]);

  const acknowledgePreparationWord = useCallback(() => {
    if (!session || session.pairs.length === 0) {
      return;
    }

    const nextPreparationWordIndex = preparationWordIndex + 1;

    if (nextPreparationWordIndex < session.pairs.length) {
      setPreparationWordIndex(nextPreparationWordIndex);

      return;
    }

    if (session.matchMode === MatchMode.Easy) {
      startEasyReinforcement();
    } else {
      startMainRound();
    }
  }, [preparationWordIndex, session, startEasyReinforcement, startMainRound]);

  const completeCurrentReinforcementWord = useCallback(() => {
    setIsLearnedWordCelebrationVisible(true);
    learnedWordCelebrationTimeout.current = setTimeout(() => {
      const nextReinforcementWordIndex = reinforcementWordIndex + 1;
      const nextReinforcementWordPair = session?.pairs[nextReinforcementWordIndex];

      setIsLearnedWordCelebrationVisible(false);

      if (!nextReinforcementWordPair || !session) {
        startMainRound();
        learnedWordCelebrationTimeout.current = null;

        return;
      }

      setReinforcementWordIndex(nextReinforcementWordIndex);
      setReinforcementCorrectRepetitionCount(0);
      setReinforcementAnswerChoices(
        createReinforcementAnswerChoices(
          nextReinforcementWordPair,
          session.pairs,
          EASY_REINFORCEMENT_CHOICE_COUNT,
        ),
      );
      setReinforcementFeedback(ReinforcementFeedback.None);
      setSelectedReinforcementAnswerId(null);
      learnedWordCelebrationTimeout.current = null;
    }, LEARNED_WORD_CELEBRATION_DURATION_MS);
  }, [reinforcementWordIndex, session, startMainRound]);

  const selectReinforcementAnswer = useCallback(
    (selectedWordPairId: string) => {
      if (
        gameStage !== GameStage.EasyReinforcement ||
        reinforcementFeedback !== ReinforcementFeedback.None ||
        isLearnedWordCelebrationVisible ||
        !currentReinforcementWordPair
      ) {
        return;
      }

      const isCorrectAnswer = selectedWordPairId === currentReinforcementWordPair.id;

      setSelectedReinforcementAnswerId(selectedWordPairId);

      if (!isCorrectAnswer) {
        setReinforcementFeedback(ReinforcementFeedback.Incorrect);
        setMismatchStatistics((currentMismatchStatistics) =>
          incrementWordPairMismatchCount(
            currentMismatchStatistics,
            currentReinforcementWordPair.id,
          ),
        );
        setWordAttemptStatistics((currentWordAttemptStatistics) =>
          incrementWordIncorrectAttempt(
            currentWordAttemptStatistics,
            currentReinforcementWordPair.id,
          ),
        );
        reinforcementFeedbackTimeout.current = setTimeout(() => {
          setReinforcementFeedback(ReinforcementFeedback.None);
          setSelectedReinforcementAnswerId(null);
          reinforcementFeedbackTimeout.current = null;
        }, EASY_REINFORCEMENT_INCORRECT_FEEDBACK_DURATION_MS);

        return;
      }

      setReinforcementFeedback(ReinforcementFeedback.Correct);
      setWordAttemptStatistics((currentWordAttemptStatistics) =>
        incrementWordCorrectAttempt(currentWordAttemptStatistics, currentReinforcementWordPair.id),
      );
      reinforcementFeedbackTimeout.current = setTimeout(() => {
        const { nextCorrectRepetitionCount, isWordComplete } = advanceReinforcementRepetition(
          reinforcementCorrectRepetitionCount,
          EASY_REINFORCEMENT_REPETITION_GOAL,
        );

        setReinforcementCorrectRepetitionCount(nextCorrectRepetitionCount);
        setReinforcementFeedback(ReinforcementFeedback.None);
        setSelectedReinforcementAnswerId(null);

        if (isWordComplete) {
          completeCurrentReinforcementWord();
        } else {
          setReinforcementAnswerChoices((currentAnswerChoices) =>
            reshuffleReinforcementAnswerChoices(
              currentAnswerChoices,
              currentReinforcementWordPair.id,
            ),
          );
        }

        reinforcementFeedbackTimeout.current = null;
      }, EASY_REINFORCEMENT_CORRECT_FEEDBACK_DURATION_MS);
    },
    [
      completeCurrentReinforcementWord,
      currentReinforcementWordPair,
      gameStage,
      isLearnedWordCelebrationVisible,
      reinforcementCorrectRepetitionCount,
      reinforcementFeedback,
    ],
  );

  const advanceMainRoundAfterCorrectMatch = useCallback(
    (
      matchedWordBoardPairId: string,
      matchedTranslationBoardPairId: string,
      shouldFreezeMatchedPair: boolean,
    ) => {
      if (!session || session.pairs.length === 0) {
        return;
      }

      if (shouldFreezeMatchedPair) {
        setCompletedWordBoardPairIds((currentCompletedWordBoardPairIds) => {
          if (currentCompletedWordBoardPairIds.includes(matchedWordBoardPairId)) {
            return currentCompletedWordBoardPairIds;
          }

          return [...currentCompletedWordBoardPairIds, matchedWordBoardPairId];
        });
        setCompletedTranslationBoardPairIds((currentCompletedTranslationBoardPairIds) => {
          if (currentCompletedTranslationBoardPairIds.includes(matchedTranslationBoardPairId)) {
            return currentCompletedTranslationBoardPairIds;
          }

          return [...currentCompletedTranslationBoardPairIds, matchedTranslationBoardPairId];
        });
        setGameBoard((currentGameBoard) =>
          arrangeRemainingWordBoard(currentGameBoard, session.matchMode),
        );
        setTranslationBoardPairs((currentTranslationBoardPairs) =>
          shuffle(currentTranslationBoardPairs),
        );
        setMainRoundScore((currentScore) => currentScore + 1);

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
          (gameBoardPair) => gameBoardPair.boardPairId === matchedWordBoardPairId,
        );
        const advancedGameBoard = replaceGameBoardPair(
          currentGameBoard,
          matchedWordBoardPairId,
          nextGameBoardPair,
        );

        return arrangeWordBoardAfterReplacement(
          advancedGameBoard,
          nextGameBoardPair.boardPairId,
          replacedBoardPairIndex,
          session.matchMode,
        );
      });
      setTranslationBoardPairs((currentTranslationBoardPairs) => {
        const replacedBoardPairIndex = currentTranslationBoardPairs.findIndex(
          (gameBoardPair) => gameBoardPair.boardPairId === matchedTranslationBoardPairId,
        );
        const advancedTranslationBoardPairs = replaceGameBoardPair(
          currentTranslationBoardPairs,
          matchedTranslationBoardPairId,
          nextGameBoardPair,
        );

        return shuffleGameBoardAfterReplacement(
          advancedTranslationBoardPairs,
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
      const practiceReplacement = selectNextUniquePracticeWordPair(
        difficultWordPairs,
        remainingGameBoard,
        nextPracticePairIndex,
      );

      setCompletedPracticeWordPairIds((currentCompletedWordPairIds) => {
        if (currentCompletedWordPairIds.includes(matchedWordPairId)) {
          return currentCompletedWordPairIds;
        }

        return [...currentCompletedWordPairIds, matchedWordPairId];
      });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      if (practiceReplacement) {
        const replacementBoardPair = createGameBoardPair(
          practiceReplacement.wordPair,
          PRACTICE_BOARD_PAIR_ID_PREFIX,
          practiceReplacement.sequenceIndex,
        );
        setNextPracticePairIndex(practiceReplacement.nextPairIndex);
        setGameBoard((currentGameBoard) => {
          const replacedBoardPairIndex = currentGameBoard.findIndex(
            (gameBoardPair) => gameBoardPair.boardPairId === matchedGameBoardPairId,
          );
          const advancedGameBoard = replaceGameBoardPair(
            currentGameBoard,
            matchedGameBoardPairId,
            replacementBoardPair,
          );

          return arrangeWordBoardAfterReplacement(
            advancedGameBoard,
            replacementBoardPair.boardPairId,
            replacedBoardPairIndex,
            session?.matchMode,
          );
        });
        setTranslationBoardPairs((currentTranslationBoardPairs) => {
          const replacedBoardPairIndex = currentTranslationBoardPairs.findIndex(
            (gameBoardPair) => gameBoardPair.boardPairId === matchedGameBoardPairId,
          );
          const advancedTranslationBoardPairs = replaceGameBoardPair(
            currentTranslationBoardPairs,
            matchedGameBoardPairId,
            replacementBoardPair,
          );

          return shuffleGameBoardAfterReplacement(
            advancedTranslationBoardPairs,
            replacementBoardPair.boardPairId,
            replacedBoardPairIndex,
          );
        });
      } else {
        setGameBoard(arrangeRemainingWordBoard(remainingGameBoard, session?.matchMode));
        setTranslationBoardPairs((currentTranslationBoardPairs) =>
          shuffle(
            currentTranslationBoardPairs.filter(
              (gameBoardPair) => gameBoardPair.boardPairId !== matchedGameBoardPairId,
            ),
          ),
        );
      }
    },
    [difficultWordPairs, gameBoard, nextPracticePairIndex, session?.matchMode],
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
        translationBoardPairs,
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
      const completionCountdown =
        isCorrectMatch && gameStage === GameStage.MainRound
          ? getFinalBatchCountdown(mainRoundScore, timedRoundPhase)
          : null;

      if (isCorrectMatch) {
        setMatchFeedback(MatchFeedback.Correct);
        setMatchCompletionCountdown(completionCountdown);
        setWordAttemptStatistics((currentWordAttemptStatistics) =>
          incrementWordCorrectAttempt(
            currentWordAttemptStatistics,
            selectedWordGameBoardPair.wordPairId,
          ),
        );

        if (completionCountdown === null) {
          setMatchCelebrationAnimation(
            selectNextMatchCelebrationAnimation(matchCelebrationAnimation),
          );
        }
      } else {
        setMatchFeedback(MatchFeedback.Incorrect);
        setMismatchStatistics((currentMismatchStatistics) =>
          incrementWordPairMismatchCount(
            currentMismatchStatistics,
            selectedWordGameBoardPair.wordPairId,
          ),
        );
        setWordAttemptStatistics((currentWordAttemptStatistics) =>
          incrementWordIncorrectAttempt(
            currentWordAttemptStatistics,
            selectedWordGameBoardPair.wordPairId,
          ),
        );
      }

      const feedbackDuration = isCorrectMatch
        ? MATCH_FEEDBACK_DURATION_MS
        : INCORRECT_FEEDBACK_DURATION_MS;

      feedbackTimeout.current = setTimeout(() => {
        if (isCorrectMatch && gameStage === GameStage.MainRound) {
          advanceMainRoundAfterCorrectMatch(
            selectedWordGameBoardPair.boardPairId,
            selectedTranslationGameBoardPair.boardPairId,
            completionCountdown !== null,
          );
        } else if (isCorrectMatch && gameStage === GameStage.DifficultWordsPractice) {
          advancePracticeRoundAfterCorrectMatch(
            selectedWordGameBoardPair.boardPairId,
            selectedWordGameBoardPair.wordPairId,
          );
        }

        setSelectedBoardPair(createEmptySelectedBoardPair());
        setMatchFeedback(MatchFeedback.None);
        setMatchCompletionCountdown(null);
        feedbackTimeout.current = null;
      }, feedbackDuration);
    },
    [
      advanceMainRoundAfterCorrectMatch,
      advancePracticeRoundAfterCorrectMatch,
      gameBoard,
      gameStage,
      matchCelebrationAnimation,
      mainRoundScore,
      timedRoundPhase,
      translationBoardPairs,
    ],
  );

  const selectWordCard = useCallback(
    (boardPairId: string) => {
      if (!isMatchingGameStage(gameStage) || matchFeedback !== MatchFeedback.None) {
        return;
      }

      if (completedWordBoardPairIds.includes(boardPairId)) {
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
    [
      completedWordBoardPairIds,
      evaluateCompletedSelection,
      gameStage,
      matchFeedback,
      selectedBoardPair,
    ],
  );

  const selectTranslationCard = useCallback(
    (boardPairId: string) => {
      if (!isMatchingGameStage(gameStage) || matchFeedback !== MatchFeedback.None) {
        return;
      }

      if (completedTranslationBoardPairIds.includes(boardPairId)) {
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
    [
      completedTranslationBoardPairIds,
      evaluateCompletedSelection,
      gameStage,
      matchFeedback,
      selectedBoardPair,
    ],
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
    setCompletedWordBoardPairIds([]);
    setCompletedTranslationBoardPairIds([]);
    setMatchCompletionCountdown(null);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setGameStage(GameStage.PracticeTransition);
  }, [mismatchStatistics, session]);

  const continueTimedRound = useCallback(() => {
    if (!timedRoundTransitionPhase) {
      return;
    }

    resetChallengeBoard(timedRoundTransitionPhase, nextMainRoundPairIndex);
    setTimedRoundPhase(timedRoundTransitionPhase);
    setTimedRoundTransitionPhase(null);
    setMainRoundScore(0);
    setSecondsRemaining(challengeStageDurationSeconds);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setMatchFeedback(MatchFeedback.None);
    setMatchCompletionCountdown(null);
    setGameStage(GameStage.MainRound);
  }, [
    challengeStageDurationSeconds,
    nextMainRoundPairIndex,
    resetChallengeBoard,
    timedRoundTransitionPhase,
  ]);

  const retryChallengeStage = useCallback(() => {
    resetChallengeBoard(timedRoundPhase, nextMainRoundPairIndex);
    setMainRoundScore(0);
    setSecondsRemaining(challengeStageDurationSeconds);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setMatchFeedback(MatchFeedback.None);
    setMatchCompletionCountdown(null);
    setGameStage(GameStage.MainRound);
  }, [challengeStageDurationSeconds, nextMainRoundPairIndex, resetChallengeBoard, timedRoundPhase]);

  useEffect(() => {
    if (gameStage !== GameStage.MainRound || matchFeedback !== MatchFeedback.None) {
      return;
    }

    if (mainRoundScore >= CHALLENGE_STAGE_MATCH_GOAL) {
      const nextTimedRoundPhase = getNextTimedRoundPhase(timedRoundPhase);

      if (nextTimedRoundPhase) {
        setTimedRoundTransitionPhase(nextTimedRoundPhase);
        setSelectedBoardPair(createEmptySelectedBoardPair());
        setGameStage(GameStage.TimedRoundTransition);
      } else {
        completeMainRound();
      }
    } else if (isTimedMainRound && secondsRemaining === 0) {
      setSelectedBoardPair(createEmptySelectedBoardPair());
      setGameStage(GameStage.ChallengeFailed);
    }
  }, [
    completeMainRound,
    gameStage,
    isTimedMainRound,
    mainRoundScore,
    matchFeedback,
    secondsRemaining,
    timedRoundPhase,
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
        setWordAttemptStatistics((currentWordAttemptStatistics) =>
          incrementWordIncorrectAttempt(currentWordAttemptStatistics, currentFinalQuizQuestion.id),
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
      setWordAttemptStatistics((currentWordAttemptStatistics) =>
        incrementWordCorrectAttempt(currentWordAttemptStatistics, currentFinalQuizQuestion.id),
      );
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

    const initialPracticeBoard = createInitialGameBoard(
      difficultWordPairs,
      PRACTICE_BOARD_SIZE,
      PRACTICE_BOARD_PAIR_ID_PREFIX,
    );

    setGameBoard(initialPracticeBoard);
    setTranslationBoardPairs(shuffle(initialPracticeBoard));
    setNextPracticePairIndex(Math.min(PRACTICE_BOARD_SIZE, difficultWordPairs.length));
    setCompletedPracticeWordPairIds([]);
    setSelectedBoardPair(createEmptySelectedBoardPair());
    setMatchFeedback(MatchFeedback.None);
    setMatchCompletionCountdown(null);
    setGameStage(GameStage.DifficultWordsPractice);
  }, [difficultWordPairs]);

  return {
    gameStage,
    currentPreparationWordPair,
    preparationWordIndex,
    preparationWordCount,
    currentReinforcementWordPair,
    reinforcementWordIndex,
    reinforcementWordCount,
    reinforcementCorrectRepetitionCount,
    reinforcementRepetitionGoal: EASY_REINFORCEMENT_REPETITION_GOAL,
    reinforcementAnswerChoices,
    reinforcementFeedback,
    selectedReinforcementAnswerId,
    isLearnedWordCelebrationVisible,
    gameBoard,
    translationBoardPairs,
    completedWordBoardPairIds,
    completedTranslationBoardPairIds,
    selectedBoardPair,
    matchFeedback,
    matchCelebrationAnimation,
    secondsRemaining,
    mainRoundScore,
    mainRoundProgress,
    practiceRoundProgress,
    completedPracticePairCount,
    practicePairCount,
    isTimedMainRound,
    matchCompletionCountdown,
    timedRoundPhase,
    timedRoundTransitionPhase,
    learningStatistics,
    currentFinalQuizQuestion,
    finalQuizAnswerChoices,
    finalQuizFeedback,
    selectedFinalQuizAnswerId,
    passedFinalQuizWordPairCount,
    finalQuizWordPairCount,
    completedWordStatistics,
    acknowledgePreparationWord,
    selectReinforcementAnswer,
    selectWordCard,
    selectTranslationCard,
    selectFinalQuizAnswer,
    retryChallengeStage,
    startDifficultWordsPractice,
    startFinalQuiz,
    continueTimedRound,
  };
}
