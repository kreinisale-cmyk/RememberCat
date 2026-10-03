import { ActiveAudioCue, AudioCuePhase } from './types';

export function isMatchingAudioCue(activeCue: ActiveAudioCue | null, expectedCue: ActiveAudioCue) {
  return activeCue?.requestId === expectedCue.requestId && activeCue.player === expectedCue.player;
}

export function shouldReportAudioCueCancellation(cue: ActiveAudioCue) {
  return cue.phase === AudioCuePhase.Pending || cue.player.currentStatus.playing;
}
