import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";
import { db } from "@/db/client";
import {
  getTransactionsForMonth,
  getMonthlyTotals,
  getMonthlyTotalsByBudgetType,
  getBudgetForMonth,
} from "@/db/queries";
import { useCurrency } from "@/lib/currency-context";

export function useMonthlyData(month: string) {
  const { currency } = useCurrency();

  const { data: transactions = [] } = useLiveQuery(
    getTransactionsForMonth(month, currency),
    [month, currency]
  );

  const { data: totalsRaw = [] } = useLiveQuery(
    getMonthlyTotals(month, currency),
    [month, currency]
  );

  const { data: budgetTypeRaw = [] } = useLiveQuery(
    getMonthlyTotalsByBudgetType(month, currency),
    [month, currency]
  );

  const { data: budgetRows = [] } = useLiveQuery(getBudgetForMonth(month), [
    month,
  ]);

  const totals = useMemo(() => {
    const income =
      totalsRaw.find((t) => t.type === "income")?.total ?? "0";
    const expense =
      totalsRaw.find((t) => t.type === "expense")?.total ?? "0";
    return {
      income: parseFloat(income),
      expense: parseFloat(expense),
      savings: parseFloat(income) - parseFloat(expense),
    };
  }, [totalsRaw]);

  const budgetTypeTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of budgetTypeRaw) {
      const key = row.budgetType ?? "uncategorized";
      map[key] = parseFloat(row.total ?? "0");
    }
    return map;
  }, [budgetTypeRaw]);

  const budget = budgetRows[0] ?? null;

  return {
    transactions,
    totals,
    budgetTypeTotals,
    budget,
  };
}
