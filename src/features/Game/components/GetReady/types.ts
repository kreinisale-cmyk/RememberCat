export type GetReadyProps = {
  onComplete: () => void;
};

export enum GetReadyPlaybackMode {
  Idle = 'idle',
  Audio = 'audio',
  Silent = 'silent',
}
