import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { MatchFeedback } from '../../types';
import { MatchCard } from '../MatchCard/MatchCard';
import { MatchCardSide } from '../MatchCard/types';
import { ProgressTrack } from './components/ProgressTrack/ProgressTrack';
import { CLOSE_GAME_ACCESSIBILITY_LABEL } from './constants';
import { styles } from './styles';
import { MatchingBoardProps } from './types';
import { getSelectedCardFeedback } from './utils';

export function MatchingBoard({
  gameBoard,
  translationBoardPairs,
  selectedBoardPair,
  completedWordBoardPairIds,
  completedTranslationBoardPairIds,
  matchFeedback,
  matchCelebrationAnimation,
  completionCountdown,
  kicker,
  title,
  hint,
  progress,
  progressLabel,
  progressMilestones,
  onClose,
  onSelectWordCard,
  onSelectTranslationCard,
}: MatchingBoardProps) {
  const isCardSelectionDisabled = matchFeedback !== MatchFeedback.None;

  return (
    <View style={styles.content}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={CLOSE_GAME_ACCESSIBILITY_LABEL}
          onPress={onClose}
          style={styles.closeButton}
        >
          <ThemedText style={styles.close}>×</ThemedText>
        </Pressable>
        <ProgressTrack progress={progress} milestones={progressMilestones} />
        <ThemedText style={styles.progressLabel}>{progressLabel}</ThemedText>
      </View>
      <View accessibilityRole="header" style={styles.heading}>
        <ThemedText style={styles.kicker}>{kicker}</ThemedText>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.hint}>{hint}</ThemedText>
      </View>
      <View style={styles.board}>
        <View style={styles.column}>
          {gameBoard.map((gameBoardPair) => (
            <MatchCard
              key={gameBoardPair.boardPairId}
              label={gameBoardPair.word}
              side={MatchCardSide.Word}
              completed={completedWordBoardPairIds.includes(gameBoardPair.boardPairId)}
              celebrationAnimation={matchCelebrationAnimation}
              completionCountdown={
                selectedBoardPair.wordBoardPairId === gameBoardPair.boardPairId
                  ? completionCountdown
                  : null
              }
              selected={selectedBoardPair.wordBoardPairId === gameBoardPair.boardPairId}
              feedback={getSelectedCardFeedback(
                matchFeedback,
                gameBoardPair.boardPairId,
                selectedBoardPair.wordBoardPairId,
              )}
              disabled={
                isCardSelectionDisabled ||
                completedWordBoardPairIds.includes(gameBoardPair.boardPairId)
              }
              onPress={() => onSelectWordCard(gameBoardPair.boardPairId)}
            />
          ))}
        </View>
        <View style={styles.column}>
          {translationBoardPairs.map((gameBoardPair) => (
            <MatchCard
              key={gameBoardPair.boardPairId}
              label={gameBoardPair.translation}
              side={MatchCardSide.Translation}
              completed={completedTranslationBoardPairIds.includes(gameBoardPair.boardPairId)}
              celebrationAnimation={matchCelebrationAnimation}
              completionCountdown={
                selectedBoardPair.translationBoardPairId === gameBoardPair.boardPairId
                  ? completionCountdown
                  : null
              }
              selected={selectedBoardPair.translationBoardPairId === gameBoardPair.boardPairId}
              feedback={getSelectedCardFeedback(
                matchFeedback,
                gameBoardPair.boardPairId,
                selectedBoardPair.translationBoardPairId,
              )}
              disabled={
                isCardSelectionDisabled ||
                completedTranslationBoardPairIds.includes(gameBoardPair.boardPairId)
              }
              onPress={() => onSelectTranslationCard(gameBoardPair.boardPairId)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
