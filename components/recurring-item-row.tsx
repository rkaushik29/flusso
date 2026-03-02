import { View } from "react-native";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { CURRENCY_SYMBOLS, type Currency } from "@/lib/constants";

type RecurringItemRowProps = {
  name: string;
  amount: number;
  currency: Currency;
  type: "income" | "expense";
  isActive: boolean;
  onToggle: (active: boolean) => void;
};

export function RecurringItemRow({
  name,
  amount,
  currency,
  type,
  isActive,
  onToggle,
}: RecurringItemRowProps) {
  return (
    <View className="flex-row items-center gap-3 px-3 py-3">
      <View className="flex-1">
        <Text className="text-sm font-medium">{name}</Text>
        <Text className="text-xs text-muted-foreground">
          {type === "income" ? "+" : "-"}
          {CURRENCY_SYMBOLS[currency]}
          {amount.toFixed(2)} / month
        </Text>
      </View>
      <Switch checked={isActive} onCheckedChange={onToggle} />
    </View>
  );
}
