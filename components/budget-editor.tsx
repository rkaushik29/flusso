import { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useColorScheme } from "@/lib/theme";

type BudgetEditorProps = {
  essential: number;
  discretionary: number;
  investment: number;
  onSave: (essential: number, discretionary: number, investment: number) => void;
  className?: string;
};

export function BudgetEditor({
  essential,
  discretionary,
  investment,
  onSave,
  className,
}: BudgetEditorProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [e, setE] = useState(String(essential));
  const [d, setD] = useState(String(discretionary));
  const [inv, setInv] = useState(String(investment));

  useEffect(() => {
    setE(String(essential));
    setD(String(discretionary));
    setInv(String(investment));
  }, [essential, discretionary, investment]);

  const total = (parseFloat(e) || 0) + (parseFloat(d) || 0) + (parseFloat(inv) || 0);
  const isValid = Math.abs(total - 100) < 0.01;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Budget Split
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-3">
        <PercentInput
          label="Essential"
          value={e}
          onChange={setE}
          colorClass="text-essential"
          isDark={isDarkColorScheme}
        />
        <PercentInput
          label="Discretionary"
          value={d}
          onChange={setD}
          colorClass="text-discretionary"
          isDark={isDarkColorScheme}
        />
        <PercentInput
          label="Investment"
          value={inv}
          onChange={setInv}
          colorClass="text-investment"
          isDark={isDarkColorScheme}
        />

        <View className="flex-row items-center justify-between pt-1">
          <Text
            className={cn(
              "text-sm font-medium",
              isValid ? "text-income" : "text-expense"
            )}
          >
            Total: {total.toFixed(0)}%
          </Text>
          <Button
            size="sm"
            disabled={!isValid}
            onPress={() =>
              onSave(parseFloat(e) || 0, parseFloat(d) || 0, parseFloat(inv) || 0)
            }
          >
            <Text className="text-primary-foreground text-sm">Save</Text>
          </Button>
        </View>
      </CardContent>
    </Card>
  );
}

function PercentInput({
  label,
  value,
  onChange,
  colorClass,
  isDark,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colorClass: string;
  isDark: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className={cn("w-28 text-sm font-medium", colorClass)}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(t) => {
          if (/^\d*\.?\d{0,1}$/.test(t) || t === "") onChange(t);
        }}
        keyboardType="decimal-pad"
        textAlignVertical="center"
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-base leading-5 text-foreground"
        placeholderTextColor={isDark ? "hsl(30, 5%, 55%)" : "hsl(30, 5%, 45%)"}
      />
      <Text className="text-muted-foreground">%</Text>
    </View>
  );
}
