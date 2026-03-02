import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  getSettings,
  updateDisplayCurrency,
  updateConversionRate,
} from "@/db/queries";
import { CURRENCY_SYMBOLS, type Currency } from "@/lib/constants";

type CurrencyContextType = {
  currency: Currency;
  symbol: string;
  conversionRate: number;
  setCurrency: (currency: Currency) => void;
  setConversionRate: (rate: number) => void;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "EUR",
  symbol: "\u20ac",
  conversionRate: 1.5,
  setCurrency: () => {},
  setConversionRate: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { data: settingsRows = [] } = useLiveQuery(getSettings());

  const currency = (settingsRows[0]?.displayCurrency ?? "EUR") as Currency;
  const symbol = CURRENCY_SYMBOLS[currency];
  const conversionRate = settingsRows[0]?.conversionRate ?? 1.5;

  const setCurrency = useCallback(async (c: Currency) => {
    await updateDisplayCurrency(c);
  }, []);

  const setConversionRate = useCallback(async (rate: number) => {
    await updateConversionRate(rate);
  }, []);

  const value = useMemo(
    () => ({ currency, symbol, conversionRate, setCurrency, setConversionRate }),
    [currency, symbol, conversionRate, setCurrency, setConversionRate]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
