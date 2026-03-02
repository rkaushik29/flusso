import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";
import {
  getMonthlyTotals,
  getMonthlyTotalsByCategory,
  getMonthlyTotalsForRange,
} from "@/db/queries";
import { useCurrency } from "@/lib/currency-context";

function subtractMonths(month: string, count: number) {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(y, m - 1 - count, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function useReportsData(month: string) {
  const { currency } = useCurrency();

  const { data: totalsRaw = [] } = useLiveQuery(
    getMonthlyTotals(month, currency),
    [month, currency]
  );

  const { data: categoryTotals = [] } = useLiveQuery(
    getMonthlyTotalsByCategory(month, currency),
    [month, currency]
  );

  const startMonth = subtractMonths(month, 5);
  const { data: rangeRaw = [] } = useLiveQuery(
    getMonthlyTotalsForRange(startMonth, month, currency),
    [month, currency]
  );

  const totals = useMemo(() => {
    const income = parseFloat(
      totalsRaw.find((t) => t.type === "income")?.total ?? "0"
    );
    const expense = parseFloat(
      totalsRaw.find((t) => t.type === "expense")?.total ?? "0"
    );
    return { income, expense, savings: income - expense };
  }, [totalsRaw]);

  const savingsRate = useMemo(() => {
    if (totals.income === 0) return 0;
    return (totals.savings / totals.income) * 100;
  }, [totals]);

  const categoryBreakdown = useMemo(() => {
    return categoryTotals
      .filter((c) => c.type === "expense")
      .map((c) => ({
        id: c.categoryId,
        name: c.categoryName ?? "Uncategorized",
        icon: c.categoryIcon ?? "more-horiz",
        total: parseFloat(c.total ?? "0"),
      }))
      .sort((a, b) => b.total - a.total);
  }, [categoryTotals]);

  const totalExpense = categoryBreakdown.reduce((s, c) => s + c.total, 0);

  const monthlyBars = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    for (const row of rangeRaw) {
      if (!map[row.month]) map[row.month] = { income: 0, expense: 0 };
      map[row.month][row.type as "income" | "expense"] = parseFloat(
        row.total ?? "0"
      );
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([m, vals]) => ({
        month: m,
        label: m.split("-")[1],
        ...vals,
      }));
  }, [rangeRaw]);

  return {
    totals,
    savingsRate,
    categoryBreakdown,
    totalExpense,
    monthlyBars,
  };
}
