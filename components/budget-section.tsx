import { useState } from "react";
import { Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
} from "react-native-reanimated";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type BudgetSectionProps = {
  title: string;
  spent: number;
  budget: number;
  colorClass: string;
  symbol: string;
  children?: React.ReactNode;
  className?: string;
};

export function BudgetSection({
  title,
  spent,
  budget,
  colorClass,
  symbol,
  children,
  className,
}: BudgetSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const overBudget = spent > budget && budget > 0;

  const rotation = useDerivedValue(() =>
    withTiming(expanded ? 90 : 0, { duration: 200 })
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const contentHeight = useDerivedValue(() =>
    withTiming(expanded ? 1 : 0, { duration: 200 })
  );

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentHeight.value,
    maxHeight: contentHeight.value * 500,
    overflow: "hidden" as const,
  }));

  return (
    <View className={cn("gap-2", className)}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        className="flex-row items-center justify-between rounded-lg p-3 active:bg-accent"
      >
        <View className="flex-1 gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="font-medium">{title}</Text>
            <Text
              className={cn(
                "text-sm",
                overBudget ? "text-expense font-semibold" : "text-muted-foreground"
              )}
            >
              {symbol}
              {spent.toFixed(0)} / {symbol}
              {budget.toFixed(0)}
            </Text>
          </View>
          <Progress
            value={pct}
            className="h-2"
            indicatorClassName={cn(
              overBudget ? "bg-expense" : colorClass
            )}
          />
        </View>
        <Animated.View style={chevronStyle} className="ml-2">
          <MaterialIcons name="chevron-right" size={20} className="text-muted-foreground" />
        </Animated.View>
      </Pressable>
      <Animated.View style={contentStyle}>
        {expanded && children}
      </Animated.View>
    </View>
  );
}
