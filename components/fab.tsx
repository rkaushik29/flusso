import { Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { cn } from "@/lib/utils";

export function Fab({
  onPress,
  className,
}: {
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "absolute bottom-20 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/20 active:scale-95",
        className
      )}
    >
      <MaterialIcons name="add" size={28} color="hsl(36, 20%, 97%)" />
    </Pressable>
  );
}
