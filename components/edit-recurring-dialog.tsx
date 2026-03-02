import { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { SegmentedControl } from "@/components/segmented-control";
import { CurrencyInput } from "@/components/currency-input";
import { CategoryPicker } from "@/components/category-picker";
import type { Currency } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme";
import { PLACEHOLDER_COLORS } from "@/lib/constants";

type RecurringData = {
  id?: number;
  name: string;
  amount: number;
  currency: Currency;
  type: "income" | "expense";
  categoryId: number | null;
  dayOfMonth: number;
};

const TYPE_SEGMENTS = [
  { label: "Expense", value: "expense" as const },
  { label: "Income", value: "income" as const },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: RecurringData | null;
  categories: { id: number; name: string; icon: string }[];
  onSave: (data: RecurringData) => void;
};

export function EditRecurringDialog({
  open,
  onOpenChange,
  item,
  categories,
  onSave,
}: Props) {
  const { isDarkColorScheme } = useColorScheme();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [dayOfMonth, setDayOfMonth] = useState("1");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setAmount(String(item.amount));
      setCurrency(item.currency);
      setType(item.type);
      setCategoryId(item.categoryId);
      setDayOfMonth(String(item.dayOfMonth));
    } else {
      setName("");
      setAmount("");
      setCurrency("EUR");
      setType("expense");
      setCategoryId(null);
      setDayOfMonth("1");
    }
  }, [item, open]);

  const handleSave = () => {
    if (!name.trim() || !amount) return;
    onSave({
      id: item?.id,
      name: name.trim(),
      amount: parseFloat(amount),
      currency,
      type,
      categoryId,
      dayOfMonth: parseInt(dayOfMonth, 10) || 1,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[340px]">
        <DialogHeader>
          <DialogTitle>
            {item?.id ? "Edit Recurring" : "New Recurring Item"}
          </DialogTitle>
        </DialogHeader>

        <View className="gap-4 py-2">
          <View className="gap-2">
            <Label>Name</Label>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Netflix, Rent"
              placeholderTextColor={isDarkColorScheme ? PLACEHOLDER_COLORS.dark : PLACEHOLDER_COLORS.light}
              className="rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
            />
          </View>

          <SegmentedControl
            segments={TYPE_SEGMENTS}
            value={type}
            onValueChange={setType}
          />

          <View className="gap-2">
            <Label>Amount</Label>
            <CurrencyInput
              value={amount}
              onChangeText={setAmount}
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          </View>

          <View className="gap-2">
            <Label>Category</Label>
            <CategoryPicker
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          </View>

          <View className="gap-2">
            <Label>Day of Month</Label>
            <TextInput
              value={dayOfMonth}
              onChangeText={setDayOfMonth}
              keyboardType="number-pad"
              placeholder="1-31"
              placeholderTextColor={isDarkColorScheme ? PLACEHOLDER_COLORS.dark : PLACEHOLDER_COLORS.light}
              className="rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
            />
          </View>
        </View>

        <DialogFooter>
          <Button variant="ghost" onPress={() => onOpenChange(false)}>
            <Text>Cancel</Text>
          </Button>
          <Button onPress={handleSave} disabled={!name.trim() || !amount}>
            <Text className="text-primary-foreground">Save</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
