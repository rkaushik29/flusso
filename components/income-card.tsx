import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export function IncomeCard({
  income,
  className,
}: {
  income: number;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Income
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text className="text-3xl font-bold text-income">
          {"\u20ac"}
          {income.toFixed(2)}
        </Text>
      </CardContent>
    </Card>
  );
}
