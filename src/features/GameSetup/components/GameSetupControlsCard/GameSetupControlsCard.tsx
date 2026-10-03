import Layers from 'lucide-react-native/icons/layers';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SettingsCard } from '@/features/Settings/components/SettingsCard/SettingsCard';
import { SettingsCardIconTone } from '@/features/Settings/components/SettingsCard/types';

import { DeckSizeSelector } from '../DeckSizeSelector/DeckSizeSelector';
import { MatchModeSelector } from '../MatchModeSelector/MatchModeSelector';
import { GAME_SETUP_CONTROLS_COPY } from './constants';
import { styles } from './styles';
import { GameSetupControlsCardProps } from './types';
import { getMatchModeDescription } from './utils';

export function GameSetupControlsCard({
  selectedDeckSize,
  selectedMatchMode,
  onDeckSizeChange,
  onMatchModeChange,
}: GameSetupControlsCardProps) {
  return (
    <SettingsCard
      icon={Layers}
      iconTone={SettingsCardIconTone.Accent}
      title={GAME_SETUP_CONTROLS_COPY.title}
      detail={GAME_SETUP_CONTROLS_COPY.detail}
    >
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          {GAME_SETUP_CONTROLS_COPY.practiceSizeTitle}
        </ThemedText>
        <ThemedText style={styles.badge}>{selectedDeckSize} words</ThemedText>
      </View>
      <DeckSizeSelector selectedDeckSize={selectedDeckSize} onChange={onDeckSizeChange} />
      <View style={styles.divider} />
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          {GAME_SETUP_CONTROLS_COPY.matchModeTitle}
        </ThemedText>
      </View>
      <MatchModeSelector selectedMatchMode={selectedMatchMode} onChange={onMatchModeChange} />
      <ThemedText style={styles.description}>
        {getMatchModeDescription(selectedMatchMode)}
      </ThemedText>
    </SettingsCard>
  );
}
