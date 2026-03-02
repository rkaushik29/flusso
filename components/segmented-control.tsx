import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SegmentedControlProps<T extends string> = {
  segments: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  segments,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<T>) {
  const activeIndex = segments.findIndex((s) => s.value === value);
  const segmentWidth = 100 / segments.length;

  const indicatorStyle = useAnimatedStyle(() => ({
    left: withTiming(`${activeIndex * segmentWidth}%` as any, { duration: 200 }),
    width: `${segmentWidth}%` as any,
  }));

  return (
    <View
      className={cn(
        "flex-row rounded-lg bg-muted p-1",
        className
      )}
    >
      <Animated.View
        style={indicatorStyle}
        className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm"
      />
      {segments.map((segment) => (
        <Pressable
          key={segment.value}
          onPress={() => onValueChange(segment.value)}
          className="flex-1 items-center py-2"
        >
          <Text
            className={cn(
              "text-sm font-medium",
              segment.value === value
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {segment.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
