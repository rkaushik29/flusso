import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import type { ComponentProps } from "react";

type CategoryEditRowProps = {
  icon: string;
  name: string;
  type: "income" | "expense";
  budgetType?: string | null;
};

export function CategoryEditRow({
  icon,
  name,
  type,
  budgetType,
}: CategoryEditRowProps) {
  return (
    <View className="flex-row items-center gap-3 px-3 py-3">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
        <MaterialIcons
          name={icon as ComponentProps<typeof MaterialIcons>["name"]}
          size={18}
          className="text-foreground"
        />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium">{name}</Text>
      </View>
      <Badge
        variant={type === "income" ? "default" : "secondary"}
        className="mr-1"
      >
        <Text className="text-xs">{type}</Text>
      </Badge>
      {budgetType && (
        <Badge variant="outline">
          <Text className="text-xs">{budgetType}</Text>
        </Badge>
      )}
    </View>
  );
}
