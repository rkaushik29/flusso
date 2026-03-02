import { DefaultTheme, type Theme } from "@react-navigation/native";

export const NAV_THEME = {
  light: {
    dark: false,
    fonts: DefaultTheme.fonts,
    colors: {
      background: "hsl(36, 20%, 97%)",
      border: "hsl(33, 12%, 89%)",
      card: "hsl(36, 18%, 95%)",
      notification: "hsl(0, 72%, 51%)",
      primary: "hsl(215, 40%, 45%)",
      text: "hsl(30, 10%, 11%)",
    },
  } satisfies Theme,
  dark: {
    dark: true,
    fonts: DefaultTheme.fonts,
    colors: {
      background: "hsl(20, 4%, 16%)",
      border: "hsl(20, 5%, 26%)",
      card: "hsl(20, 4%, 19%)",
      notification: "hsl(0, 62%, 55%)",
      primary: "hsl(215, 40%, 50%)",
      text: "hsl(35, 18%, 85%)",
    },
  } satisfies Theme,
};

export const CHART_COLORS = {
  income: "hsl(142, 60%, 40%)",
  expense: "hsl(0, 72%, 51%)",
  savings: "hsl(200, 60%, 50%)",
  essential: "hsl(8, 55%, 52%)",
  discretionary: "hsl(38, 65%, 52%)",
  investment: "hsl(150, 35%, 42%)",
};

export const PLACEHOLDER_COLORS = {
  light: "hsl(30, 5%, 45%)",
  dark: "hsl(30, 8%, 55%)",
};

export const CATEGORY_ICONS: Record<string, string> = {
  Rent: "home",
  Groceries: "shopping-cart",
  Utilities: "flash-on",
  Transport: "directions-car",
  Dining: "restaurant",
  Entertainment: "movie",
  Health: "favorite",
  Shopping: "local-mall",
  Subscriptions: "subscriptions",
  Education: "school",
  Travel: "flight",
  Gifts: "card-giftcard",
  Insurance: "security",
  Savings: "savings",
  Investments: "trending-up",
  Salary: "account-balance-wallet",
  Freelance: "work",
  "Side Income": "attach-money",
  Other: "more-horiz",
};

export const CURRENCIES = ["EUR", "CAD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "\u20ac",
  CAD: "CA$",
};
