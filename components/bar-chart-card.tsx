import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type MonthBar = {
  label: string;
  income: number;
  expense: number;
};

export function BarChartCard({
  data,
  className,
}: {
  data: MonthBar[];
  className?: string;
}) {
  if (data.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="items-center py-8">
          <Text className="text-muted-foreground">No data yet</Text>
        </CardContent>
      </Card>
    );
  }

  const barData = data.flatMap((m) => [
    {
      value: m.income,
      label: m.label,
      frontColor: CHART_COLORS.income,
      spacing: 2,
    },
    {
      value: m.expense,
      frontColor: CHART_COLORS.expense,
      spacing: 16,
    },
  ]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Income vs Expenses (6 months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          data={barData}
          barWidth={14}
          spacing={12}
          noOfSections={4}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          isAnimated
          barBorderRadius={3}
        />
        <View className="mt-2 flex-row justify-center gap-4">
          <View className="flex-row items-center gap-1">
            <View
              style={{ backgroundColor: CHART_COLORS.income }}
              className="h-2.5 w-2.5 rounded-full"
            />
            <Text className="text-xs text-muted-foreground">Income</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View
              style={{ backgroundColor: CHART_COLORS.expense }}
              className="h-2.5 w-2.5 rounded-full"
            />
            <Text className="text-xs text-muted-foreground">Expenses</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
