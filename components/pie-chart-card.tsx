import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const COLORS = [
  "#c27a4a",
  "#9b7cb8",
  "#5d8faf",
  "#6d9b72",
  "#c45c5c",
  "#c4993d",
  "#7a7db8",
  "#5d9b8f",
];

type PieChartCardProps = {
  data: { name: string; total: number }[];
  totalExpense: number;
  symbol: string;
  className?: string;
};

export function PieChartCard({
  data,
  totalExpense,
  symbol,
  className,
}: PieChartCardProps) {
  if (data.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="items-center py-8">
          <Text className="text-muted-foreground">No expense data</Text>
        </CardContent>
      </Card>
    );
  }

  const pieData = data.slice(0, 8).map((item, i) => ({
    value: item.total,
    color: COLORS[i % COLORS.length],
    text: item.name,
  }));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="items-center">
        <PieChart
          data={pieData}
          donut
          radius={80}
          innerRadius={50}
          innerCircleColor="transparent"
          centerLabelComponent={() => (
            <View className="items-center">
              <Text className="text-xs text-muted-foreground">Total</Text>
              <Text className="text-sm font-bold">
                {symbol}
                {totalExpense.toFixed(0)}
              </Text>
            </View>
          )}
        />
        <View className="mt-3 flex-row flex-wrap justify-center gap-3">
          {pieData.map((item, i) => (
            <View key={i} className="flex-row items-center gap-1">
              <View
                style={{ backgroundColor: item.color }}
                className="h-2.5 w-2.5 rounded-full"
              />
              <Text className="text-xs text-muted-foreground">{item.text}</Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}
