import { Animated, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
      <MaterialIcons name="delete" size={22} color="#fff" />
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
