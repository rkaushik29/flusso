import { View } from "react-native";
import { AppIcon } from "@/components/app-icon";
import { Text } from "@/components/ui/text";

type CategoryBreakdownRowProps = {
  icon: string;
  name: string;
  total: number;
  maxTotal: number;
  symbol: string;
};

export function CategoryBreakdownRow({
  icon,
  name,
  total,
  maxTotal,
  symbol,
}: CategoryBreakdownRowProps) {
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

  return (
    <View className="flex-row items-center gap-3 py-2">
      <View className="h-8 w-8 items-center justify-center rounded-full bg-muted">
        <AppIcon name={icon} size={16} />
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm">{name}</Text>
          <Text className="text-sm font-medium">
            {symbol}
            {total.toFixed(0)}
          </Text>
        </View>
        <View className="h-1.5 rounded-full bg-muted">
          <View
            className="h-1.5 rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </View>
      </View>
    </View>
  );
}
