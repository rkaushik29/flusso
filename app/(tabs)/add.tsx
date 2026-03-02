import { useState, useCallback } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SegmentedControl } from "@/components/segmented-control";
import { CurrencyInput } from "@/components/currency-input";
import { CategoryPicker } from "@/components/category-picker";
import { ScreenshotFlow } from "@/components/screenshot-flow";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTransactionForm } from "@/hooks/use-transaction-form";
import { useColorScheme } from "@/lib/theme";
import type { ParsedReceipt } from "@/lib/ocr";

const TYPE_SEGMENTS = [
  { label: "Expense", value: "expense" as const },
  { label: "Income", value: "income" as const },
];

const MODE_SEGMENTS = [
  { label: "Manual", value: "manual" as const },
  { label: "Screenshot", value: "screenshot" as const },
];

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const { isDarkColorScheme } = useColorScheme();
  const form = useTransactionForm();
  const [mode, setMode] = useState<"manual" | "screenshot">("manual");

  const handleSubmit = async () => {
    const ok = await form.submit();
    if (ok) {
      Alert.alert("Saved", "Transaction added successfully.");
    }
  };

  const handleScreenshotResult = useCallback(
    (result: ParsedReceipt) => {
      form.setAmount(String(result.amount));
      form.setCurrency(result.currency === "CAD" ? "CAD" : "EUR");
      form.setDescription(result.description);
      if (result.date) form.setDate(result.date);
      // Try to match category by name
      const match = form.categories.find(
        (c) => c.name.toLowerCase() === result.category.toLowerCase()
      );
      if (match) form.setCategoryId(match.id);
      // Switch to manual for review
      setMode("manual");
    },
    [form]
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 40,
          paddingHorizontal: 16,
          gap: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="h3" className="text-left">
          Add Transaction
        </Text>

        {/* Mode Toggle */}
        <SegmentedControl
          segments={MODE_SEGMENTS}
          value={mode}
          onValueChange={setMode}
        />

        {mode === "screenshot" ? (
          <ScreenshotFlow onResult={handleScreenshotResult} />
        ) : (
          <>
            {/* Type */}
            <SegmentedControl
              segments={TYPE_SEGMENTS}
              value={form.type}
              onValueChange={form.setType}
            />

            {/* Amount */}
            <View className="gap-2">
              <Label>Amount</Label>
              <CurrencyInput
                value={form.amount}
                onChangeText={form.setAmount}
                currency={form.currency}
                onCurrencyChange={form.setCurrency}
              />
            </View>

            {/* Category */}
            <View className="gap-2">
              <Label>Category</Label>
              <CategoryPicker
                categories={form.categories}
                selectedId={form.categoryId}
                onSelect={form.setCategoryId}
              />
            </View>

            {/* Description */}
            <View className="gap-2">
              <Label>Description (optional)</Label>
              <TextInput
                value={form.description}
                onChangeText={form.setDescription}
                placeholder="Coffee, groceries, etc."
                placeholderTextColor={isDarkColorScheme ? "hsl(30, 5%, 55%)" : "hsl(30, 5%, 45%)"}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground"
              />
            </View>

            {/* Date */}
            <View className="gap-2">
              <Label>Date</Label>
              <TextInput
                value={form.date}
                onChangeText={form.setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDarkColorScheme ? "hsl(30, 5%, 55%)" : "hsl(30, 5%, 45%)"}
                className="rounded-lg border border-input bg-background px-3 py-2.5 text-base text-foreground"
              />
            </View>

            {/* Submit */}
            <Button
              onPress={handleSubmit}
              disabled={!form.isValid}
              className="mt-2"
            >
              <Text className="text-primary-foreground font-semibold">
                Save Transaction
              </Text>
            </Button>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
