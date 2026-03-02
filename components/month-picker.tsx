import { Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${year}`;
}

function addMonth(month: string, delta: number) {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function MonthPicker({
  month,
  onMonthChange,
  className,
}: {
  month: string;
  onMonthChange: (month: string) => void;
  className?: string;
}) {
  return (
    <View className={cn("flex-row items-center justify-between", className)}>
      <Pressable
        onPress={() => onMonthChange(addMonth(month, -1))}
        className="rounded-full p-2 active:bg-accent"
        hitSlop={12}
      >
        <MaterialIcons name="chevron-left" size={24} className="text-foreground" />
      </Pressable>
      <Text className="text-lg font-semibold">{formatMonth(month)}</Text>
      <Pressable
        onPress={() => onMonthChange(addMonth(month, 1))}
        className="rounded-full p-2 active:bg-accent"
        hitSlop={12}
      >
        <MaterialIcons name="chevron-right" size={24} className="text-foreground" />
      </Pressable>
    </View>
  );
}
