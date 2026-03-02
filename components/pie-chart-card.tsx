import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const COLORS = [
  "#e57c23",
  "#8b5cf6",
  "#0ea5e9",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
  "#6366f1",
  "#14b8a6",
];

type PieChartCardProps = {
  data: { name: string; total: number }[];
  totalExpense: number;
  className?: string;
};

export function PieChartCard({
  data,
  totalExpense,
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
                {"\u20ac"}
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
