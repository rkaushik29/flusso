import { useState, useCallback } from "react";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { getCategoriesByType, insertTransaction } from "@/db/queries";
import { useCurrency } from "@/lib/currency-context";
import type { Currency } from "@/lib/constants";

export function useTransactionForm() {
  const { currency: globalCurrency } = useCurrency();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>(globalCurrency);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });

  const { data: categories = [] } = useLiveQuery(
    getCategoriesByType(type),
    [type]
  );

  const isValid = amount !== "" && parseFloat(amount) > 0 && categoryId !== null;

  const reset = useCallback(() => {
    setAmount("");
    setCurrency(globalCurrency);
    setCategoryId(null);
    setDescription("");
    const now = new Date();
    setDate(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    );
  }, [globalCurrency]);

  const submit = useCallback(async () => {
    if (!isValid) return false;
    await insertTransaction({
      amount: parseFloat(amount),
      currency,
      type,
      description,
      categoryId,
      date,
    });
    reset();
    return true;
  }, [isValid, amount, currency, type, description, categoryId, date, reset]);

  return {
    type,
    setType,
    amount,
    setAmount,
    currency,
    setCurrency,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    date,
    setDate,
    categories,
    isValid,
    submit,
    reset,
  };
}
