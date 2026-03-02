import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type TransactionRowProps = {
  icon: ComponentProps<typeof MaterialIcons>["name"];
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  className?: string;
};

export function TransactionRow({
  icon,
  description,
  category,
  amount,
  type,
  className,
}: TransactionRowProps) {
  return (
    <View className={cn("flex-row items-center gap-3 px-3 py-2.5", className)}>
      <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
        <MaterialIcons name={icon} size={18} className="text-foreground" />
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
        {"\u20ac"}
        {amount.toFixed(2)}
      </Text>
    </View>
  );
}
