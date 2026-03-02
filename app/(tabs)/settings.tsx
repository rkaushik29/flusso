import { useState, useCallback } from "react";
import { ScrollView, View, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { CategoryEditRow } from "@/components/category-edit-row";
import { EditCategoryDialog } from "@/components/edit-category-dialog";
import { RecurringItemRow } from "@/components/recurring-item-row";
import { EditRecurringDialog } from "@/components/edit-recurring-dialog";
import { BudgetEditor } from "@/components/budget-editor";
import { SegmentedControl } from "@/components/segmented-control";
import { SwipeableRow } from "@/components/swipeable-row";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useCurrency } from "@/lib/currency-context";
import { useColorScheme } from "@/lib/theme";
import { PLACEHOLDER_COLORS, type Currency } from "@/lib/constants";
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
  const { isDarkColorScheme } = useColorScheme();
  const month = currentMonth();

  const { currency, setCurrency, conversionRate, setConversionRate } =
    useCurrency();
  const { data: allCategories = [] } = useLiveQuery(getCategories());
  const { data: recurringItemsRaw = [] } = useLiveQuery(getRecurringItems());
  const { data: budgetRows = [] } = useLiveQuery(getBudgetForMonth(month));

  const budget = budgetRows[0] ?? {
    essentialPercent: 50,
    discretionaryPercent: 30,
    investmentPercent: 20,
  };

  // Conversion rate local state for editing
  const [rateText, setRateText] = useState(String(conversionRate));
  const handleRateBlur = useCallback(() => {
    const parsed = parseFloat(rateText);
    if (!isNaN(parsed) && parsed > 0) {
      setConversionRate(parsed);
    } else {
      setRateText(String(conversionRate));
    }
  }, [rateText, conversionRate, setConversionRate]);

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

  const [tab, setTab] = useState("general");

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top + 16 }}>
      <Text variant="h3" className="px-4 text-left mb-3">
        Settings
      </Text>

      <Tabs value={tab} onValueChange={setTab} className="flex-1">
        <TabsList className="mx-4 mb-3">
          <TabsTrigger value="general">
            <Text>General</Text>
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Text>Categories</Text>
          </TabsTrigger>
          <TabsTrigger value="recurring">
            <Text>Recurring</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40, gap: 12, paddingHorizontal: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Currency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Currency
                </CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <SegmentedControl<Currency>
                  segments={[
                    { label: "EUR (\u20ac)", value: "EUR" },
                    { label: "CAD (CA$)", value: "CAD" },
                  ]}
                  value={currency}
                  onValueChange={setCurrency}
                />
                <View className="flex-row items-center gap-3">
                  <Text className="text-sm text-muted-foreground">1 EUR =</Text>
                  <TextInput
                    value={rateText}
                    onChangeText={(t) => {
                      if (/^\d*\.?\d{0,4}$/.test(t) || t === "") setRateText(t);
                    }}
                    onBlur={handleRateBlur}
                    keyboardType="decimal-pad"
                    textAlignVertical="center"
                    className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-center text-base leading-5 text-foreground"
                    placeholderTextColor={
                      isDarkColorScheme ? PLACEHOLDER_COLORS.dark : PLACEHOLDER_COLORS.light
                    }
                  />
                  <Text className="text-sm text-muted-foreground">CAD</Text>
                </View>
              </CardContent>
            </Card>

            {/* Budget Split */}
            <BudgetEditor
              essential={budget.essentialPercent}
              discretionary={budget.discretionaryPercent}
              investment={budget.investmentPercent}
              onSave={handleSaveBudget}
            />
          </ScrollView>
        </TabsContent>

        <TabsContent value="categories" className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
          >
            <View className="flex-row items-center justify-between mb-2">
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
            <Card>
              <CardContent className="px-0 py-0">
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
              </CardContent>
            </Card>
          </ScrollView>
        </TabsContent>

        <TabsContent value="recurring" className="flex-1">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
          >
            <View className="flex-row items-center justify-between mb-2">
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
            <Card>
              <CardContent className="px-0 py-0">
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
                        onToggle={(active) =>
                          handleToggleRecurring(item.id, active)
                        }
                      />
                    </SwipeableRow>
                  ))
                )}
              </CardContent>
            </Card>
          </ScrollView>
        </TabsContent>
      </Tabs>

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
    </View>
  );
}
