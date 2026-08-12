import { Redirect, router } from 'expo-router';
import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGameSession } from '@/features/GameSession/useGameSession/useGameSession';

import { FinalQuizTransition } from './components/FinalQuizTransition/FinalQuizTransition';
import { FinalQuiz } from './components/FinalQuiz/FinalQuiz';
import { LearningStatistics } from './components/LearningStatistics/LearningStatistics';
import { MatchingBoard } from './components/MatchingBoard/MatchingBoard';
import { PracticeTransition } from './components/PracticeTransition/PracticeTransition';
import { TimedRoundTransition } from './components/TimedRoundTransition/TimedRoundTransition';
import {
  GAME_SETUP_ROUTE,
  MAIN_ROUND_HINT,
  MAIN_ROUND_TITLE,
  MATCH_GOAL,
  PRACTICE_ROUND_HINT,
  PRACTICE_ROUND_KICKER,
  PRACTICE_ROUND_TITLE,
  TIMED_ROUND_PROGRESS_MILESTONES,
} from './constants';
import { useMatchingGame } from './hooks/useMatchingGame/useMatchingGame';
import { styles } from './styles';
import { GameStage } from './types';
import {
  createMainRoundKicker,
  createRoundProgressLabel,
  createTimedRoundPhaseLabel,
} from './utils';

export function Game() {
  const { session } = useGameSession();
  const matchingGame = useMatchingGame(session);

  if (!session) {
    return <Redirect href={GAME_SETUP_ROUTE} />;
  }

  function leaveGame() {
    router.back();
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
    case GameStage.DifficultWordsPractice:
      gameStageContent = (
        <MatchingBoard
          gameBoard={matchingGame.gameBoard}
          translationBoardPairs={matchingGame.translationBoardPairs}
          selectedBoardPair={matchingGame.selectedBoardPair}
          matchFeedback={matchingGame.matchFeedback}
          kicker={PRACTICE_ROUND_KICKER}
          title={PRACTICE_ROUND_TITLE}
          hint={PRACTICE_ROUND_HINT}
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
        gameStageContent = (
          <LearningStatistics
            learningStatistics={matchingGame.learningStatistics}
            practicePairCount={matchingGame.practicePairCount}
            onReturnToSetup={returnToGameSetup}
          />
        );
      }
      break;
    case GameStage.LearningStatistics:
      gameStageContent = (
        <LearningStatistics
          learningStatistics={matchingGame.learningStatistics}
          practicePairCount={matchingGame.practicePairCount}
          onReturnToSetup={returnToGameSetup}
        />
      );
      break;
    case GameStage.MainRound:
    default:
      gameStageContent = (
        <MatchingBoard
          gameBoard={matchingGame.gameBoard}
          translationBoardPairs={matchingGame.translationBoardPairs}
          selectedBoardPair={matchingGame.selectedBoardPair}
          matchFeedback={matchingGame.matchFeedback}
          kicker={createMainRoundKicker(
            matchingGame.isTimedMainRound,
            matchingGame.secondsRemaining,
          )}
          title={MAIN_ROUND_TITLE}
          hint={MAIN_ROUND_HINT}
          progress={matchingGame.mainRoundProgress}
          progressLabel={
            matchingGame.isTimedMainRound
              ? createTimedRoundPhaseLabel(matchingGame.timedRoundPhase)
              : createRoundProgressLabel(matchingGame.mainRoundScore, MATCH_GOAL)
          }
          progressMilestones={
            matchingGame.isTimedMainRound ? TIMED_ROUND_PROGRESS_MILESTONES : undefined
          }
          onClose={leaveGame}
          onSelectWordCard={matchingGame.selectWordCard}
          onSelectTranslationCard={matchingGame.selectTranslationCard}
        />
      );
      break;
  }

  return <SafeAreaView style={styles.screen}>{gameStageContent}</SafeAreaView>;
}
