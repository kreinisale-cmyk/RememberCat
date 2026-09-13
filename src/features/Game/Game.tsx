import { Redirect, router } from 'expo-router';
import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { ChallengeFailed } from './components/ChallengeFailed/ChallengeFailed';
import { EasyReinforcement } from './components/EasyReinforcement/EasyReinforcement';
import { FinalQuiz } from './components/FinalQuiz/FinalQuiz';
import { FinalQuizTransition } from './components/FinalQuizTransition/FinalQuizTransition';
import { LearningStatistics } from './components/LearningStatistics/LearningStatistics';
import { MatchingBoard } from './components/MatchingBoard/MatchingBoard';
import { PracticeTransition } from './components/PracticeTransition/PracticeTransition';
import { PreparationSession } from './components/PreparationSession/PreparationSession';
import { TimedRoundTransition } from './components/TimedRoundTransition/TimedRoundTransition';
import {
  CHALLENGE_STAGE_MATCH_GOAL,
  GAME_SETUP_ROUTE,
  MAIN_ROUND_TITLE,
  PRACTICE_ROUND_KICKER,
  PRACTICE_ROUND_TITLE,
} from './constants';
import { useMatchingGame } from './hooks/useMatchingGame/useMatchingGame';
import { useGameFeedback } from './hooks/useGameFeedback/useGameFeedback';
import { usePersistCompletedGameStatistics } from './hooks/usePersistCompletedGameStatistics';
import { styles } from './styles';
import { GameStage } from './types';
import {
  createMainRoundHint,
  createMainRoundKicker,
  createPracticeRoundHint,
  createRoundProgressLabel,
} from './utils';

export function Game() {
  const { session, wordMasteries, saveAssessmentStatistics } = useGameSession();
  const matchingGame = useMatchingGame(session, wordMasteries);

  const gameFeedback = useGameFeedback({
    hasActiveSession: session !== null,
    gameStage: matchingGame.gameStage,
    preparationWordIndex: matchingGame.preparationWordIndex,
    matchFeedback: matchingGame.matchFeedback,
    reinforcementFeedback: matchingGame.reinforcementFeedback,
    finalQuizFeedback: matchingGame.finalQuizFeedback,
  });

  usePersistCompletedGameStatistics({
    savedDeckId: session?.savedDeckId ?? null,
    gameResult: matchingGame.gameResult,
    focusedReviewState: matchingGame.focusedReviewState,
    focusedReviewAssessmentStatistics: matchingGame.focusedReviewAssessmentStatistics,
    focusedReviewWordStatistics: matchingGame.focusedReviewWordStatistics,
    saveAssessmentStatistics,
  });

  if (!session) {
    return <Redirect href={GAME_SETUP_ROUTE} />;
  }

  function leaveGame() {
    router.replace(GAME_SETUP_ROUTE);
  }

  function returnToGameSetup() {
    router.replace(GAME_SETUP_ROUTE);
  }

  if (matchingGame.gameStage === GameStage.PracticeTransition) {
    return <PracticeTransition onContinue={matchingGame.startDifficultWordsPractice} />;
  }

  if (
    matchingGame.gameStage === GameStage.TimedRoundTransition &&
    matchingGame.timedRoundTransitionPhase
  ) {
    return (
      <TimedRoundTransition
        targetPhase={matchingGame.timedRoundTransitionPhase}
        onContinue={matchingGame.continueTimedRound}
      />
    );
  }

  if (matchingGame.gameStage === GameStage.FinalQuizTransition) {
    return <FinalQuizTransition onContinue={matchingGame.startFinalQuiz} />;
  }

  let gameStageContent: ReactNode;

  switch (matchingGame.gameStage) {
    case GameStage.Preparation:
      if (matchingGame.currentPreparationWordPair) {
        gameStageContent = (
          <PreparationSession
            wordPair={matchingGame.currentPreparationWordPair}
            wordPairs={session.pairs}
            currentWordNumber={matchingGame.preparationWordIndex + 1}
            totalWordCount={matchingGame.preparationWordCount}
            onAcknowledge={matchingGame.acknowledgePreparationWord}
            onClose={leaveGame}
            onSkip={matchingGame.skipPreparation}
            onWordLanded={gameFeedback.announcePreparationWordLearned}
          />
        );
      } else {
        gameStageContent = null;
      }
      break;

    case GameStage.EasyReinforcement:
      if (matchingGame.currentReinforcementWordPair) {
        gameStageContent = (
          <EasyReinforcement
            key={matchingGame.currentReinforcementWordPair.id}
            wordPair={matchingGame.currentReinforcementWordPair}
            answerChoices={matchingGame.reinforcementAnswerChoices}
            currentWordNumber={matchingGame.reinforcementWordIndex + 1}
            totalWordCount={matchingGame.reinforcementWordCount}
            correctRepetitionCount={matchingGame.reinforcementCorrectRepetitionCount}
            repetitionGoal={matchingGame.reinforcementRepetitionGoal}
            feedback={matchingGame.reinforcementFeedback}
            selectedAnswerId={matchingGame.selectedReinforcementAnswerId}
            isCelebrating={matchingGame.isLearnedWordCelebrationVisible}
            onClose={leaveGame}
            onSelectAnswer={matchingGame.selectReinforcementAnswer}
          />
        );
      } else {
        gameStageContent = null;
      }
      break;

    case GameStage.ChallengeFailed:
      gameStageContent = (
        <ChallengeFailed
          phase={matchingGame.timedRoundPhase}
          completedMatchCount={matchingGame.mainRoundScore}
          targetMatchCount={CHALLENGE_STAGE_MATCH_GOAL}
          onRetry={matchingGame.retryChallengeStage}
          onClose={returnToGameSetup}
        />
      );
      break;

    case GameStage.DifficultWordsPractice:
      gameStageContent = (
        <MatchingBoard
          gameBoard={matchingGame.gameBoard}
          translationBoardPairs={matchingGame.translationBoardPairs}
          completedWordBoardPairIds={matchingGame.completedWordBoardPairIds}
          completedTranslationBoardPairIds={matchingGame.completedTranslationBoardPairIds}
          selectedBoardPair={matchingGame.selectedBoardPair}
          matchFeedback={matchingGame.matchFeedback}
          matchCelebrationAnimation={matchingGame.matchCelebrationAnimation}
          completionCountdown={null}
          kicker={PRACTICE_ROUND_KICKER}
          title={PRACTICE_ROUND_TITLE}
          hint={createPracticeRoundHint(session.matchMode)}
          progress={matchingGame.practiceRoundProgress}
          progressLabel={createRoundProgressLabel(
            matchingGame.completedPracticePairCount,
            matchingGame.practicePairCount,
          )}
          onClose={leaveGame}
          onSelectWordCard={matchingGame.selectWordCard}
          onSelectTranslationCard={matchingGame.selectTranslationCard}
        />
      );
      break;

    case GameStage.FinalQuiz:
      if (matchingGame.currentFinalQuizQuestion) {
        gameStageContent = (
          <FinalQuiz
            questionWordPair={matchingGame.currentFinalQuizQuestion}
            answerChoices={matchingGame.finalQuizAnswerChoices}
            feedback={matchingGame.finalQuizFeedback}
            selectedAnswerId={matchingGame.selectedFinalQuizAnswerId}
            passedWordPairCount={matchingGame.passedFinalQuizWordPairCount}
            totalWordPairCount={matchingGame.finalQuizWordPairCount}
            onClose={leaveGame}
            onSelectAnswer={matchingGame.selectFinalQuizAnswer}
          />
        );
      } else {
        gameStageContent = matchingGame.gameResult ? (
          <LearningStatistics
            result={matchingGame.gameResult}
            focusedReviewState={matchingGame.focusedReviewState}
            onReviewMissedWords={matchingGame.startFocusedReview}
            onReturnToSetup={returnToGameSetup}
          />
        ) : null;
      }
      break;

    case GameStage.LearningStatistics:
      gameStageContent = matchingGame.gameResult ? (
        <LearningStatistics
          result={matchingGame.gameResult}
          focusedReviewState={matchingGame.focusedReviewState}
          onReviewMissedWords={matchingGame.startFocusedReview}
          onReturnToSetup={returnToGameSetup}
        />
      ) : null;
      break;

    case GameStage.MainRound:

    default:
      gameStageContent = (
        <MatchingBoard
          gameBoard={matchingGame.gameBoard}
          translationBoardPairs={matchingGame.translationBoardPairs}
          completedWordBoardPairIds={matchingGame.completedWordBoardPairIds}
          completedTranslationBoardPairIds={matchingGame.completedTranslationBoardPairIds}
          selectedBoardPair={matchingGame.selectedBoardPair}
          matchFeedback={matchingGame.matchFeedback}
          matchCelebrationAnimation={matchingGame.matchCelebrationAnimation}
          completionCountdown={matchingGame.matchCompletionCountdown}
          kicker={createMainRoundKicker(
            matchingGame.isTimedMainRound,
            matchingGame.secondsRemaining,
            matchingGame.timedRoundPhase,
          )}
          title={MAIN_ROUND_TITLE}
          hint={createMainRoundHint(session.matchMode)}
          progress={matchingGame.mainRoundProgress}
          progressLabel={createRoundProgressLabel(
            matchingGame.mainRoundScore,
            CHALLENGE_STAGE_MATCH_GOAL,
          )}
          onClose={leaveGame}
          onSelectWordCard={matchingGame.selectWordCard}
          onSelectTranslationCard={matchingGame.selectTranslationCard}
        />
      );
      break;
  }

  return <SafeAreaView style={styles.screen}>{gameStageContent}</SafeAreaView>;
}
