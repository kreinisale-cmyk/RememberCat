import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react-native';

export enum SettingsCardIconTone {
  Secondary = 'secondary',
  Accent = 'accent',
}

export type SettingsCardProps = {
  title: string;
  detail: string;
  children: ReactNode;
  badge?: string;
  icon?: LucideIcon;
  iconTone?: SettingsCardIconTone;
};
