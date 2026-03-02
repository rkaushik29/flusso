import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SummaryBarProps = {
  income: number;
  expenses: number;
  savings: number;
  symbol: string;
  className?: string;
};

export function SummaryBar({
  income,
  expenses,
  savings,
  symbol,
  className,
}: SummaryBarProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-around border-t border-border bg-card px-4 py-3",
        className
      )}
    >
      <SummaryItem label="Income" value={income} symbol={symbol} colorClass="text-income" />
      <Separator orientation="vertical" className="h-8" />
      <SummaryItem label="Expenses" value={expenses} symbol={symbol} colorClass="text-expense" />
      <Separator orientation="vertical" className="h-8" />
      <SummaryItem
        label="Savings"
        value={savings}
        symbol={symbol}
        colorClass={savings >= 0 ? "text-savings" : "text-expense"}
      />
    </View>
  );
}

function SummaryItem({
  label,
  value,
  symbol,
  colorClass,
}: {
  label: string;
  value: number;
  symbol: string;
  colorClass: string;
}) {
  return (
    <View className="items-center">
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className={cn("text-sm font-semibold", colorClass)}>
        {symbol}
        {Math.abs(value).toFixed(0)}
      </Text>
    </View>
  );
}
