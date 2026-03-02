import { and, between, desc, eq, sql, sum } from "drizzle-orm";
import { db } from "./client";
import {
  categories,
  monthlyBudgets,
  recurringItems,
  transactions,
} from "./schema";

// ── Helpers ──────────────────────────────────────────────────────────

function monthRange(month: string) {
  // month is "YYYY-MM"
  return {
    start: `${month}-01`,
    end: `${month}-31`,
  };
}

// ── Categories ───────────────────────────────────────────────────────

export function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}

export function getCategoriesByType(type: "income" | "expense") {
  return db
    .select()
    .from(categories)
    .where(eq(categories.type, type))
    .orderBy(categories.name);
}

export function insertCategory(
  data: typeof categories.$inferInsert
) {
  return db.insert(categories).values(data);
}

export function updateCategory(
  id: number,
  data: Partial<typeof categories.$inferInsert>
) {
  return db.update(categories).set(data).where(eq(categories.id, id));
}

export function deleteCategory(id: number) {
  return db.delete(categories).where(eq(categories.id, id));
}

// ── Monthly Budgets ──────────────────────────────────────────────────

export function getBudgetForMonth(month: string) {
  return db
    .select()
    .from(monthlyBudgets)
    .where(eq(monthlyBudgets.month, month))
    .limit(1);
}

export function upsertBudget(data: typeof monthlyBudgets.$inferInsert) {
  return db
    .insert(monthlyBudgets)
    .values(data)
    .onConflictDoUpdate({
      target: monthlyBudgets.month,
      set: {
        essentialPercent: data.essentialPercent,
        discretionaryPercent: data.discretionaryPercent,
        investmentPercent: data.investmentPercent,
      },
    });
}

// ── Recurring Items ──────────────────────────────────────────────────

export function getRecurringItems() {
  return db
    .select({
      recurringItem: recurringItems,
      category: categories,
    })
    .from(recurringItems)
    .leftJoin(categories, eq(recurringItems.categoryId, categories.id))
    .orderBy(recurringItems.name);
}

export function getActiveRecurringItems() {
  return db
    .select({
      recurringItem: recurringItems,
      category: categories,
    })
    .from(recurringItems)
    .leftJoin(categories, eq(recurringItems.categoryId, categories.id))
    .where(eq(recurringItems.isActive, true))
    .orderBy(recurringItems.dayOfMonth);
}

export function insertRecurringItem(
  data: typeof recurringItems.$inferInsert
) {
  return db.insert(recurringItems).values(data);
}

export function updateRecurringItem(
  id: number,
  data: Partial<typeof recurringItems.$inferInsert>
) {
  return db
    .update(recurringItems)
    .set(data)
    .where(eq(recurringItems.id, id));
}

export function deleteRecurringItem(id: number) {
  return db.delete(recurringItems).where(eq(recurringItems.id, id));
}

// ── Transactions ─────────────────────────────────────────────────────

export function getTransactionsForMonth(month: string) {
  const { start, end } = monthRange(month);
  return db
    .select({
      transaction: transactions,
      category: categories,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(between(transactions.date, start, end))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));
}

export function insertTransaction(
  data: typeof transactions.$inferInsert
) {
  return db.insert(transactions).values(data);
}

export function updateTransaction(
  id: number,
  data: Partial<typeof transactions.$inferInsert>
) {
  return db.update(transactions).set(data).where(eq(transactions.id, id));
}

export function deleteTransaction(id: number) {
  return db.delete(transactions).where(eq(transactions.id, id));
}

// ── Aggregations ─────────────────────────────────────────────────────

export function getMonthlyTotals(month: string) {
  const { start, end } = monthRange(month);
  return db
    .select({
      type: transactions.type,
      total: sum(transactions.amount).as("total"),
    })
    .from(transactions)
    .where(between(transactions.date, start, end))
    .groupBy(transactions.type);
}

export function getMonthlyTotalsByBudgetType(month: string) {
  const { start, end } = monthRange(month);
  return db
    .select({
      budgetType: categories.budgetType,
      total: sum(transactions.amount).as("total"),
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        between(transactions.date, start, end),
        eq(transactions.type, "expense")
      )
    )
    .groupBy(categories.budgetType);
}

export function getMonthlyTotalsByCategory(month: string) {
  const { start, end } = monthRange(month);
  return db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      type: transactions.type,
      total: sum(transactions.amount).as("total"),
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(between(transactions.date, start, end))
    .groupBy(transactions.categoryId)
    .orderBy(sql`total DESC`);
}

export function getMonthlyTotalsForRange(startMonth: string, endMonth: string) {
  const start = `${startMonth}-01`;
  const end = `${endMonth}-31`;
  return db
    .select({
      month: sql<string>`substr(${transactions.date}, 1, 7)`.as("month"),
      type: transactions.type,
      total: sum(transactions.amount).as("total"),
    })
    .from(transactions)
    .where(between(transactions.date, start, end))
    .groupBy(sql`month`, transactions.type)
    .orderBy(sql`month`);
}
