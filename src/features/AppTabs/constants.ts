import BookText from 'lucide-react-native/icons/book-text';
import ChartColumn from 'lucide-react-native/icons/chart-column';
import Gamepad2 from 'lucide-react-native/icons/gamepad-2';

export const APP_TAB_COPY = {
  game: 'Game',
  words: 'Words',
  statistics: 'Statistics',
} as const;

export const APP_TAB_ICONS = {
  game: Gamepad2,
  words: BookText,
  statistics: ChartColumn,
} as const;
export const APP_TAB_ACTIVE_COLOR = '#e94646';
export const APP_TAB_INACTIVE_COLOR = '#805d6d';
export const APP_TAB_BAR_HEIGHT = 112;
export const APP_TAB_BAR_BOTTOM_PADDING = 50;
