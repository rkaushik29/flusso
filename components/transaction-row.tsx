import { View } from "react-native";
import { AppIcon } from "@/components/app-icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type TransactionRowProps = {
  icon: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  symbol: string;
  className?: string;
};

export function TransactionRow({
  icon,
  description,
  category,
  amount,
  type,
  symbol,
  className,
}: TransactionRowProps) {
  return (
    <View className={cn("flex-row items-center gap-3 px-3 py-2.5", className)}>
      <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
        <AppIcon name={icon} size={18} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium" numberOfLines={1}>
          {description || category}
        </Text>
        {description ? (
          <Text className="text-xs text-muted-foreground">{category}</Text>
        ) : null}
      </View>
      <Text
        className={cn(
          "text-sm font-semibold",
          type === "income" ? "text-income" : "text-foreground"
        )}
      >
        {type === "income" ? "+" : "-"}
        {symbol}
        {amount.toFixed(2)}
      </Text>
    </View>
  );
}
