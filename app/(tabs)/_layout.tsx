import { Tabs } from "expo-router";
import { AppIcon } from "@/components/app-icon";
import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/lib/theme";

export default function TabLayout() {
  const { theme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text + "80",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="home" size={size} color={color} duotoneColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="add-circle" size={size} color={color} duotoneColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="bar-chart" size={size} color={color} duotoneColor={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <AppIcon name="settings" size={size} color={color} duotoneColor={color} />
          ),
        }}
      />
    </Tabs>
  );
}
