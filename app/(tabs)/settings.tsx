import { useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { CategoryEditRow } from "@/components/category-edit-row";
import { EditCategoryDialog } from "@/components/edit-category-dialog";
import { RecurringItemRow } from "@/components/recurring-item-row";
import { EditRecurringDialog } from "@/components/edit-recurring-dialog";
import { BudgetEditor } from "@/components/budget-editor";
import { SwipeableRow } from "@/components/swipeable-row";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import {
  getCategories,
  getRecurringItems,
  getBudgetForMonth,
  insertCategory,
  updateCategory,
  deleteCategory,
  insertRecurringItem,
  updateRecurringItem,
  deleteRecurringItem,
  upsertBudget,
} from "@/db/queries";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const month = currentMonth();

  const { data: allCategories = [] } = useLiveQuery(getCategories());
  const { data: recurringItemsRaw = [] } = useLiveQuery(getRecurringItems());
  const { data: budgetRows = [] } = useLiveQuery(getBudgetForMonth(month));

  const budget = budgetRows[0] ?? {
    essentialPercent: 50,
    discretionaryPercent: 30,
    investmentPercent: 20,
  };

  // Category dialog
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Recurring dialog
  const [recDialogOpen, setRecDialogOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<any>(null);

  const handleSaveCategory = useCallback(
    async (data: any) => {
      if (data.id) {
        await updateCategory(data.id, data);
      } else {
        await insertCategory(data);
      }
    },
    []
  );

  const handleDeleteCategory = useCallback(async (id: number) => {
    await deleteCategory(id);
  }, []);

  const handleSaveRecurring = useCallback(
    async (data: any) => {
      if (data.id) {
        await updateRecurringItem(data.id, data);
      } else {
        await insertRecurringItem(data);
      }
    },
    []
  );

  const handleDeleteRecurring = useCallback(async (id: number) => {
    await deleteRecurringItem(id);
  }, []);

  const handleToggleRecurring = useCallback(
    async (id: number, active: boolean) => {
      await updateRecurringItem(id, { isActive: active });
    },
    []
  );

  const handleSaveBudget = useCallback(
    async (e: number, d: number, i: number) => {
      await upsertBudget({
        month,
        essentialPercent: e,
        discretionaryPercent: d,
        investmentPercent: i,
      });
    },
    [month]
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: 40,
        gap: 16,
      }}
    >
      <Text variant="h3" className="px-4 text-left">
        Settings
      </Text>

      {/* Budget Split */}
      <BudgetEditor
        essential={budget.essentialPercent}
        discretionary={budget.discretionaryPercent}
        investment={budget.investmentPercent}
        onSave={handleSaveBudget}
        className="mx-4"
      />

      <Separator className="mx-4" />

      {/* Categories */}
      <View className="px-4">
        <View className="flex-row items-center justify-between">
          <Text variant="large">Categories</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setEditingCategory(null);
              setCatDialogOpen(true);
            }}
          >
            <Text className="text-primary text-sm">+ Add</Text>
          </Button>
        </View>
        <View className="mt-2">
          {allCategories.map((cat) => (
            <SwipeableRow
              key={cat.id}
              onDelete={() => handleDeleteCategory(cat.id)}
            >
              <CategoryEditRow
                icon={cat.icon}
                name={cat.name}
                type={cat.type}
                budgetType={cat.budgetType}
              />
            </SwipeableRow>
          ))}
        </View>
      </View>

      <Separator className="mx-4" />

      {/* Recurring Items */}
      <View className="px-4">
        <View className="flex-row items-center justify-between">
          <Text variant="large">Recurring</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setEditingRecurring(null);
              setRecDialogOpen(true);
            }}
          >
            <Text className="text-primary text-sm">+ Add</Text>
          </Button>
        </View>
        <View className="mt-2">
          {recurringItemsRaw.length === 0 ? (
            <Text className="py-4 text-center text-muted-foreground">
              No recurring items
            </Text>
          ) : (
            recurringItemsRaw.map(({ recurringItem: item }) => (
              <SwipeableRow
                key={item.id}
                onDelete={() => handleDeleteRecurring(item.id)}
              >
                <RecurringItemRow
                  name={item.name}
                  amount={item.amount}
                  currency={item.currency}
                  type={item.type}
                  isActive={item.isActive}
                  onToggle={(active) => handleToggleRecurring(item.id, active)}
                />
              </SwipeableRow>
            ))
          )}
        </View>
      </View>

      {/* Dialogs */}
      <EditCategoryDialog
        open={catDialogOpen}
        onOpenChange={setCatDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <EditRecurringDialog
        open={recDialogOpen}
        onOpenChange={setRecDialogOpen}
        item={editingRecurring}
        categories={allCategories}
        onSave={handleSaveRecurring}
      />
    </ScrollView>
  );
}
