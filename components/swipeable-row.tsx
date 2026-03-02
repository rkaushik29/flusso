import { Animated, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { AppIcon } from "@/components/app-icon";

type SwipeableRowProps = {
  onDelete: () => void;
  children: React.ReactNode;
};

export function SwipeableRow({ onDelete, children }: SwipeableRowProps) {
  const renderRightActions = () => (
    <RectButton
      style={{
        backgroundColor: "hsl(0, 72%, 51%)",
        justifyContent: "center",
        alignItems: "center",
        width: 72,
      }}
      onPress={onDelete}
    >
      <AppIcon name="delete" size={22} color="#fff" duotoneColor="#fff" />
    </RectButton>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      {children}
    </Swipeable>
  );
}
