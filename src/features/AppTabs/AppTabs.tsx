import { Tabs } from 'expo-router';

import { AppTabIcon } from './components/AppTabIcon/AppTabIcon';
import {
  APP_TAB_ACTIVE_COLOR,
  APP_TAB_COPY,
  APP_TAB_ICONS,
  APP_TAB_INACTIVE_COLOR,
} from './constants';
import { styles } from './styles';
import { AppTab } from './types';

export function AppTabs() {
  return (
    <Tabs
      initialRouteName={AppTab.Game}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: APP_TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: APP_TAB_INACTIVE_COLOR,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name={AppTab.Game}
        options={{
          title: APP_TAB_COPY.game,
          tabBarIcon: ({ color, focused }) => (
            <AppTabIcon color={color} focused={focused} icon={APP_TAB_ICONS.game} />
          ),
        }}
      />
      <Tabs.Screen
        name={AppTab.Words}
        options={{
          title: APP_TAB_COPY.words,
          tabBarIcon: ({ color, focused }) => (
            <AppTabIcon color={color} focused={focused} icon={APP_TAB_ICONS.words} />
          ),
        }}
      />
      <Tabs.Screen
        name={AppTab.Statistics}
        options={{
          title: APP_TAB_COPY.statistics,
          tabBarIcon: ({ color, focused }) => (
            <AppTabIcon color={color} focused={focused} icon={APP_TAB_ICONS.statistics} />
          ),
        }}
      />
      <Tabs.Screen
        name={AppTab.Settings}
        options={{
          title: APP_TAB_COPY.settings,
          tabBarIcon: ({ color, focused }) => (
            <AppTabIcon color={color} focused={focused} icon={APP_TAB_ICONS.settings} />
          ),
        }}
      />
    </Tabs>
  );
}
