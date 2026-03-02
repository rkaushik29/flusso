import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("more-horiz"),
  type: text("type", { enum: ["income", "expense"] })
    .notNull()
    .default("expense"),
  budgetType: text("budget_type", {
    enum: ["essential", "discretionary", "investment"],
  }),
  isDefault: integer("is_default", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const monthlyBudgets = sqliteTable("monthly_budgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  month: text("month").notNull().unique(), // "2025-03" format
  essentialPercent: real("essential_percent").notNull().default(50),
  discretionaryPercent: real("discretionary_percent").notNull().default(30),
  investmentPercent: real("investment_percent").notNull().default(20),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const recurringItems = sqliteTable("recurring_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency", { enum: ["EUR", "CAD"] })
    .notNull()
    .default("EUR"),
  type: text("type", { enum: ["income", "expense"] })
    .notNull()
    .default("expense"),
  categoryId: integer("category_id").references(() => categories.id),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  dayOfMonth: integer("day_of_month").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  amount: real("amount").notNull(),
  currency: text("currency", { enum: ["EUR", "CAD"] })
    .notNull()
    .default("EUR"),
  type: text("type", { enum: ["income", "expense"] })
    .notNull()
    .default("expense"),
  description: text("description").notNull().default(""),
  categoryId: integer("category_id").references(() => categories.id),
  date: text("date").notNull(), // "2025-03-15" format
  isRecurring: integer("is_recurring", { mode: "boolean" })
    .notNull()
    .default(false),
  recurringItemId: integer("recurring_item_id").references(
    () => recurringItems.id
  ),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  displayCurrency: text("display_currency", { enum: ["EUR", "CAD"] })
    .notNull()
    .default("EUR"),
  conversionRate: real("conversion_rate").notNull().default(1.5),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
  recurringItems: many(recurringItems),
}));

export const recurringItemsRelations = relations(
  recurringItems,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [recurringItems.categoryId],
      references: [categories.id],
    }),
    transactions: many(transactions),
  })
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  recurringItem: one(recurringItems, {
    fields: [transactions.recurringItemId],
    references: [recurringItems.id],
  }),
}));
