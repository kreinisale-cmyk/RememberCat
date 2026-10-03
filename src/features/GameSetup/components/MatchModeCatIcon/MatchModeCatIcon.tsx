import Svg, { Path } from 'react-native-svg';

import {
  MATCH_MODE_CAT_OUTLINE,
  MATCH_MODE_CAT_STROKE_WIDTH,
  MATCH_MODE_CAT_VIEW_BOX,
} from './constants';
import { styles } from './styles';
import { MatchModeCatIconProps } from './types';
import { isHappyCat } from './utils';

export function MatchModeCatIcon({ matchMode, color, size }: MatchModeCatIconProps) {
  const isHappy = isHappyCat(matchMode);

  return (
    <Svg
      aria-hidden
      height={size}
      pointerEvents="none"
      style={styles.icon}
      viewBox={MATCH_MODE_CAT_VIEW_BOX}
      width={size}
    >
      <Path
        d={MATCH_MODE_CAT_OUTLINE}
        fill="none"
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={MATCH_MODE_CAT_STROKE_WIDTH}
      />
      <Path
        d={isHappy ? 'M7 14q1-2 2 0m6 0q1-2 2 0' : 'm7 12 2 1.5m8-1.5-2 1.5'}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={MATCH_MODE_CAT_STROKE_WIDTH}
      />
      <Path
        d="M11.25 16.25h1.5L12 17l-.75-.75Z"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={MATCH_MODE_CAT_STROKE_WIDTH}
      />
    </Svg>
  );
}
