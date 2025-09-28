import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import Octicons from "@expo/vector-icons/build/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import React from "react";

import { TabBarButton } from "@/components/TabBarButton";
import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { useBookmarkStore } from "@/store/bookmarkStore";

export default function TabLayout() {
  const tabBarBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  const tabBarActiveTintColor = useThemeColor({
    light: theme.colorReactDarkBlue,
    dark: theme.colorWhite,
  });

  const tabBarInactiveTintColor = useThemeColor({
    light: theme.colorGrey,
    dark: `rgba(255, 255, 255, 0.35)`,
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <TabBarButton
              {...props}
              activeTintColor={tabBarActiveTintColor}
              inactiveTintColor={tabBarInactiveTintColor}
              icon={({ color }) => (
                <Feather size={24} name="calendar" color={color} />
              )}
            />
          ),
        }}
      />
    </Tabs>
  );
}
