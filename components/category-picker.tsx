import { FlatList, Pressable, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Category = {
  id: number;
  name: string;
  icon: string;
};

type CategoryPickerProps = {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  className?: string;
};

export function CategoryPicker({
  categories,
  selectedId,
  onSelect,
  className,
}: CategoryPickerProps) {
  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="gap-2 px-1"
      className={className}
      renderItem={({ item }) => {
        const isSelected = item.id === selectedId;
        return (
          <Pressable
            onPress={() => onSelect(item.id)}
            className={cn(
              "items-center gap-1 rounded-xl px-3 py-2",
              isSelected ? "bg-primary" : "bg-muted active:bg-accent"
            )}
          >
            <MaterialIcons
              name={item.icon as ComponentProps<typeof MaterialIcons>["name"]}
              size={22}
              color={isSelected ? "hsl(36, 20%, 97%)" : undefined}
              className={isSelected ? "" : "text-foreground"}
            />
            <Text
              className={cn(
                "text-xs",
                isSelected
                  ? "text-primary-foreground font-medium"
                  : "text-muted-foreground"
              )}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
