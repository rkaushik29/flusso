import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MonthPicker } from "@/components/month-picker";
import { SavingsRateCard } from "@/components/savings-rate-card";
import { PieChartCard } from "@/components/pie-chart-card";
import { BarChartCard } from "@/components/bar-chart-card";
import { CategoryBreakdownRow } from "@/components/category-breakdown-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useReportsData } from "@/hooks/use-reports-data";
import { useCurrency } from "@/lib/currency-context";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [month, setMonth] = useState(currentMonth);
  const { symbol } = useCurrency();
  const { savingsRate, categoryBreakdown, totalExpense, monthlyBars } =
    useReportsData(month);

  const maxCategory = categoryBreakdown[0]?.total ?? 0;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: 40,
        gap: 12,
      }}
    >
      <MonthPicker month={month} onMonthChange={setMonth} className="px-4 py-2" />

      <SavingsRateCard rate={savingsRate} className="mx-4" />

      <PieChartCard
        data={categoryBreakdown}
        totalExpense={totalExpense}
        symbol={symbol}
        className="mx-4"
      />

      <BarChartCard data={monthlyBars} className="mx-4" />

      {/* Category Breakdown */}
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length === 0 ? (
            <Text className="py-4 text-center text-muted-foreground">
              No expense data
            </Text>
          ) : (
            categoryBreakdown.map((c) => (
              <CategoryBreakdownRow
                key={c.id}
                icon={c.icon}
                name={c.name}
                total={c.total}
                maxTotal={maxCategory}
                symbol={symbol}
              />
            ))
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
