import { AppIcon } from "@/components/app-icon";
import type { SymbolWeight, SymbolViewProps } from "expo-symbols";
import type { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconMapping = Record<string, string>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  // Navigation
  "house.fill": "home",
  "paperplane.fill": "attach-money",
  "chevron.left.forwardslash.chevron.right": "more-horiz",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  // Tabs
  "plus.circle.fill": "add-circle",
  "chart.bar.fill": "bar-chart",
  "gearshape.fill": "settings",
  // Finance
  "dollarsign.circle.fill": "attach-money",
  "creditcard.fill": "attach-money",
  "arrow.up.circle.fill": "trending-up",
  "arrow.down.circle.fill": "trending-up",
  // Actions
  "trash.fill": "delete",
  "pencil": "more-horiz",
  "xmark": "more-horiz",
  "checkmark": "more-horiz",
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
};

export function IconSymbol({
  name,
  size = 24,
  color,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const mapped = MAPPING[name as string] ?? "more-horiz";
  return <AppIcon name={mapped} size={size} color={color as string} />;
}
