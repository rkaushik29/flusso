import { Pressable, TextInput, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { CURRENCIES, CURRENCY_SYMBOLS, type Currency } from "@/lib/constants";
import { useColorScheme } from "@/lib/theme";
import { PLACEHOLDER_COLORS } from "@/lib/constants";

type CurrencyInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  className?: string;
};

export function CurrencyInput({
  value,
  onChangeText,
  currency,
  onCurrencyChange,
  className,
}: CurrencyInputProps) {
  const { isDarkColorScheme } = useColorScheme();

  const toggleCurrency = () => {
    const idx = CURRENCIES.indexOf(currency);
    onCurrencyChange(CURRENCIES[(idx + 1) % CURRENCIES.length]);
  };

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Pressable
        onPress={toggleCurrency}
        className="rounded-lg bg-muted px-3 py-2.5 active:bg-accent"
      >
        <Text className="text-lg font-semibold">
          {CURRENCY_SYMBOLS[currency]}
        </Text>
      </Pressable>
      <TextInput
        value={value}
        onChangeText={(text) => {
          // Only allow valid decimal input
          if (/^\d*\.?\d{0,2}$/.test(text) || text === "") {
            onChangeText(text);
          }
        }}
        placeholder="0.00"
        placeholderTextColor={isDarkColorScheme ? PLACEHOLDER_COLORS.dark : PLACEHOLDER_COLORS.light}
        keyboardType="decimal-pad"
        className="flex-1 rounded-lg border border-input bg-background px-3 py-2.5 text-2xl font-bold text-foreground"
      />
    </View>
  );
}
