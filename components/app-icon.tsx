import {
  House,
  ShoppingCart,
  Lightning,
  Car,
  ForkKnife,
  FilmSlate,
  Heart,
  Storefront,
  MonitorPlay,
  GraduationCap,
  AirplaneTilt,
  Gift,
  ShieldCheck,
  PiggyBank,
  TrendUp,
  Wallet,
  Briefcase,
  CurrencyDollar,
  DotsThreeOutline,
  Plus,
  PlusCircle,
  CaretRight,
  CaretLeft,
  ChartBar,
  Gear,
  Trash,
  Image as ImageIcon,
  Camera,
  type IconProps,
} from "phosphor-react-native";
import { useColorScheme } from "@/lib/theme";

const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  home: House,
  "shopping-cart": ShoppingCart,
  "flash-on": Lightning,
  "directions-car": Car,
  restaurant: ForkKnife,
  movie: FilmSlate,
  favorite: Heart,
  "local-mall": Storefront,
  subscriptions: MonitorPlay,
  school: GraduationCap,
  flight: AirplaneTilt,
  "card-giftcard": Gift,
  security: ShieldCheck,
  savings: PiggyBank,
  "trending-up": TrendUp,
  "account-balance-wallet": Wallet,
  work: Briefcase,
  "attach-money": CurrencyDollar,
  "more-horiz": DotsThreeOutline,
  add: Plus,
  "add-circle": PlusCircle,
  "chevron-right": CaretRight,
  "chevron-left": CaretLeft,
  "bar-chart": ChartBar,
  settings: Gear,
  delete: Trash,
  photo: ImageIcon,
  "camera-alt": Camera,
};

type AppIconProps = {
  name: string;
  size?: number;
  color?: string;
  duotoneColor?: string;
  weight?: "duotone" | "bold" | "regular" | "thin" | "light" | "fill";
};

export function AppIcon({
  name,
  size = 24,
  color,
  duotoneColor,
  weight = "duotone",
}: AppIconProps) {
  const { isDarkColorScheme } = useColorScheme();

  const defaultColor = "#ffffff";
  const defaultDuotone = isDarkColorScheme
    ? "hsl(30, 8%, 55%)"
    : "hsl(30, 5%, 45%)";

  const Icon = ICON_MAP[name];
  if (!Icon) return null;

  return (
    <Icon
      size={size}
      color={color ?? defaultColor}
      weight={weight}
      duotoneColor={duotoneColor ?? defaultDuotone}
    />
  );
}
