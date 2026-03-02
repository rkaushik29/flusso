import { useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { MonthPicker } from "@/components/month-picker";
import { IncomeCard } from "@/components/income-card";
import { BudgetSection } from "@/components/budget-section";
import { TransactionRow } from "@/components/transaction-row";
import { SwipeableRow } from "@/components/swipeable-row";
import { SummaryBar } from "@/components/summary-bar";
import { Fab } from "@/components/fab";
import { Text } from "@/components/ui/text";
import { useMonthlyData } from "@/hooks/use-monthly-data";
import { useCurrency } from "@/lib/currency-context";
import { deleteTransaction } from "@/db/queries";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function OverviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [month, setMonth] = useState(currentMonth);
  const { symbol } = useCurrency();
  const { transactions, totals, budgetTypeTotals, budget } =
    useMonthlyData(month);

  const essentialBudget = budget
    ? (totals.income * budget.essentialPercent) / 100
    : 0;
  const discretionaryBudget = budget
    ? (totals.income * budget.discretionaryPercent) / 100
    : 0;
  const investmentBudget = budget
    ? (totals.income * budget.investmentPercent) / 100
    : 0;

  const handleDelete = useCallback(async (id: number) => {
    await deleteTransaction(id);
  }, []);

  const expenseTransactions = transactions.filter(
    (t) => t.transaction.type === "expense"
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 100 }}
      >
        <MonthPicker month={month} onMonthChange={setMonth} className="px-4 py-2" />

        <IncomeCard income={totals.income} symbol={symbol} className="mx-4 mt-2" />

        {/* Budget Sections */}
        <View className="mt-4 px-4">
          <Text variant="large" className="mb-2">
            Budget
          </Text>

          <BudgetSection
            title="Essential"
            spent={budgetTypeTotals.essential ?? 0}
            budget={essentialBudget}
            colorClass="bg-essential"
            symbol={symbol}
          >
            <TransactionList
              transactions={expenseTransactions.filter(
                (t) => t.category?.budgetType === "essential"
              )}
              onDelete={handleDelete}
              symbol={symbol}
            />
          </BudgetSection>

          <BudgetSection
            title="Discretionary"
            spent={budgetTypeTotals.discretionary ?? 0}
            budget={discretionaryBudget}
            colorClass="bg-discretionary"
            symbol={symbol}
          >
            <TransactionList
              transactions={expenseTransactions.filter(
                (t) => t.category?.budgetType === "discretionary"
              )}
              onDelete={handleDelete}
              symbol={symbol}
            />
          </BudgetSection>

          <BudgetSection
            title="Investment"
            spent={budgetTypeTotals.investment ?? 0}
            budget={investmentBudget}
            colorClass="bg-investment"
            symbol={symbol}
          >
            <TransactionList
              transactions={expenseTransactions.filter(
                (t) => t.category?.budgetType === "investment"
              )}
              onDelete={handleDelete}
              symbol={symbol}
            />
          </BudgetSection>
        </View>

        {/* Recent Transactions */}
        <View className="mt-4 px-4">
          <Text variant="large" className="mb-2">
            Transactions
          </Text>
          {transactions.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-muted-foreground">
                No transactions this month
              </Text>
            </View>
          ) : (
            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
              symbol={symbol}
            />
          )}
        </View>
      </ScrollView>

      <SummaryBar
        income={totals.income}
        expenses={totals.expense}
        savings={totals.savings}
        symbol={symbol}
      />

      <Fab onPress={() => router.push("/(tabs)/add")} />
    </View>
  );
}

function TransactionList({
  transactions,
  onDelete,
  symbol,
}: {
  transactions: Array<{
    transaction: { id: number; amount: number; type: "income" | "expense"; description: string };
    category: { name: string; icon: string; budgetType?: string | null } | null;
  }>;
  onDelete: (id: number) => void;
  symbol: string;
}) {
  if (transactions.length === 0) {
    return (
      <View className="items-center py-4">
        <Text className="text-sm text-muted-foreground">No items</Text>
      </View>
    );
  }

  return (
    <View>
      {transactions.map(({ transaction: t, category: c }) => (
        <SwipeableRow key={t.id} onDelete={() => onDelete(t.id)}>
          <TransactionRow
            icon={(c?.icon as any) ?? "more-horiz"}
            description={t.description}
            category={c?.name ?? "Uncategorized"}
            amount={t.amount}
            type={t.type}
            symbol={symbol}
          />
        </SwipeableRow>
      ))}
    </View>
  );
}
