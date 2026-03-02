import { eq } from "drizzle-orm";
import type { db as DbType } from "./client";
import { categories, monthlyBudgets } from "./schema";

const DEFAULT_CATEGORIES = [
  { name: "Salary", icon: "account-balance-wallet", type: "income" as const },
  { name: "Freelance", icon: "work", type: "income" as const },
  { name: "Side Income", icon: "attach-money", type: "income" as const },
  {
    name: "Rent",
    icon: "home",
    type: "expense" as const,
    budgetType: "essential" as const,
  },
  {
    name: "Groceries",
    icon: "shopping-cart",
    type: "expense" as const,
    budgetType: "essential" as const,
  },
  {
    name: "Utilities",
    icon: "flash-on",
    type: "expense" as const,
    budgetType: "essential" as const,
  },
  {
    name: "Transport",
    icon: "directions-car",
    type: "expense" as const,
    budgetType: "essential" as const,
  },
  {
    name: "Health",
    icon: "favorite",
    type: "expense" as const,
    budgetType: "essential" as const,
  },
  {
    name: "Insurance",
    icon: "security",
    type: "expense" as const,
    budgetType: "essential" as const,
  },
  {
    name: "Dining",
    icon: "restaurant",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Entertainment",
    icon: "movie",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Shopping",
    icon: "local-mall",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Subscriptions",
    icon: "subscriptions",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Education",
    icon: "school",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Travel",
    icon: "flight",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Gifts",
    icon: "card-giftcard",
    type: "expense" as const,
    budgetType: "discretionary" as const,
  },
  {
    name: "Savings",
    icon: "savings",
    type: "expense" as const,
    budgetType: "investment" as const,
  },
  {
    name: "Investments",
    icon: "trending-up",
    type: "expense" as const,
    budgetType: "investment" as const,
  },
  { name: "Other", icon: "more-horiz", type: "expense" as const },
];

export async function seed(database: typeof DbType) {
  // Check if already seeded
  const existing = await database
    .select()
    .from(categories)
    .where(eq(categories.isDefault, true))
    .limit(1);

  if (existing.length > 0) return;

  // Insert default categories
  await database.insert(categories).values(
    DEFAULT_CATEGORIES.map((c) => ({
      ...c,
      isDefault: true,
    }))
  );

  // Insert current month budget
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  await database.insert(monthlyBudgets).values({
    month,
    essentialPercent: 50,
    discretionaryPercent: 30,
    investmentPercent: 20,
  });
}
