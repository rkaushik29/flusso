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
      primary: "hsl(30, 10%, 15%)",
      text: "hsl(30, 10%, 11%)",
    },
  } satisfies Theme,
  dark: {
    dark: true,
    fonts: DefaultTheme.fonts,
    colors: {
      background: "hsl(30, 5%, 10%)",
      border: "hsl(30, 5%, 20%)",
      card: "hsl(30, 5%, 13%)",
      notification: "hsl(0, 62%, 55%)",
      primary: "hsl(33, 10%, 88%)",
      text: "hsl(33, 10%, 88%)",
    },
  } satisfies Theme,
};

export const CHART_COLORS = {
  income: "hsl(142, 60%, 40%)",
  expense: "hsl(0, 72%, 51%)",
  savings: "hsl(210, 60%, 50%)",
  essential: "hsl(25, 80%, 52%)",
  discretionary: "hsl(270, 50%, 55%)",
  investment: "hsl(175, 60%, 40%)",
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
