import { View } from "react-native";
import { AppIcon } from "@/components/app-icon";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

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
        <AppIcon name={icon} size={18} />
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
