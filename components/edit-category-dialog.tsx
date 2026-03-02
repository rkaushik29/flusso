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
import { useColorScheme } from "@/lib/theme";
import { PLACEHOLDER_COLORS } from "@/lib/constants";

type CategoryData = {
  id?: number;
  name: string;
  icon: string;
  type: "income" | "expense";
  budgetType: "essential" | "discretionary" | "investment" | null;
};

const TYPE_SEGMENTS = [
  { label: "Expense", value: "expense" as const },
  { label: "Income", value: "income" as const },
];

const BUDGET_SEGMENTS = [
  { label: "Essential", value: "essential" as const },
  { label: "Discret.", value: "discretionary" as const },
  { label: "Invest.", value: "investment" as const },
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryData | null;
  onSave: (data: CategoryData) => void;
};

export function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: Props) {
  const { isDarkColorScheme } = useColorScheme();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("more-horiz");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [budgetType, setBudgetType] = useState<
    "essential" | "discretionary" | "investment"
  >("essential");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setType(category.type);
      setBudgetType(category.budgetType ?? "essential");
    } else {
      setName("");
      setIcon("more-horiz");
      setType("expense");
      setBudgetType("essential");
    }
  }, [category, open]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: category?.id,
      name: name.trim(),
      icon,
      type,
      budgetType: type === "expense" ? budgetType : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[340px]">
        <DialogHeader>
          <DialogTitle>
            {category?.id ? "Edit Category" : "New Category"}
          </DialogTitle>
        </DialogHeader>

        <View className="gap-4 py-2">
          <View className="gap-2">
            <Label>Name</Label>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Category name"
              placeholderTextColor={isDarkColorScheme ? PLACEHOLDER_COLORS.dark : PLACEHOLDER_COLORS.light}
              className="rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
            />
          </View>

          <View className="gap-2">
            <Label>Icon (Material Icon name)</Label>
            <TextInput
              value={icon}
              onChangeText={setIcon}
              placeholder="e.g. shopping-cart"
              placeholderTextColor={isDarkColorScheme ? PLACEHOLDER_COLORS.dark : PLACEHOLDER_COLORS.light}
              className="rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground"
            />
          </View>

          <View className="gap-2">
            <Label>Type</Label>
            <SegmentedControl
              segments={TYPE_SEGMENTS}
              value={type}
              onValueChange={setType}
            />
          </View>

          {type === "expense" && (
            <View className="gap-2">
              <Label>Budget Type</Label>
              <SegmentedControl
                segments={BUDGET_SEGMENTS}
                value={budgetType}
                onValueChange={setBudgetType}
              />
            </View>
          )}
        </View>

        <DialogFooter>
          <Button variant="ghost" onPress={() => onOpenChange(false)}>
            <Text>Cancel</Text>
          </Button>
          <Button onPress={handleSave} disabled={!name.trim()}>
            <Text className="text-primary-foreground">Save</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
