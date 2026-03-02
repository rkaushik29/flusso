import { Pressable } from "react-native";
import { AppIcon } from "@/components/app-icon";
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
        "absolute bottom-20 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary active:scale-95",
        className
      )}
    >
      <AppIcon name="add" size={28} />
    </Pressable>
  );
}
