import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export function SavingsRateCard({
  rate,
  className,
}: {
  rate: number;
  className?: string;
}) {
  const color =
    rate >= 20
      ? "text-income"
      : rate >= 0
        ? "text-savings"
        : "text-expense";

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Savings Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text className={cn("text-4xl font-bold", color)}>
          {rate.toFixed(1)}%
        </Text>
        <Text className="mt-1 text-xs text-muted-foreground">
          {rate >= 20
            ? "Great job!"
            : rate >= 0
              ? "Room for improvement"
              : "Spending exceeds income"}
        </Text>
      </CardContent>
    </Card>
  );
}
