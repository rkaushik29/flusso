import "@/global.css";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { DatabaseProvider } from "@/db/provider";
import { CurrencyProvider } from "@/lib/currency-context";
import { useColorScheme } from "@/lib/theme";
import { NAV_THEME } from "@/lib/constants";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light}>
        <DatabaseProvider>
          <CurrencyProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </CurrencyProvider>
        </DatabaseProvider>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
