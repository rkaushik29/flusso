import { useColorScheme as useNativeColorScheme } from "react-native";
import { NAV_THEME } from "./constants";

export function useColorScheme() {
  const colorScheme = useNativeColorScheme();
  const isDarkColorScheme = colorScheme === "dark";
  return {
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme,
    theme: isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light,
  };
}
