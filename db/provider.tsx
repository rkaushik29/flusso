import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { db } from "./client";
import migrations from "./migrations/migrations";
import { seed } from "./seed";

type DatabaseContextType = {
  db: typeof db;
  isReady: boolean;
};

const DatabaseContext = createContext<DatabaseContextType>({
  db,
  isReady: false,
});

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const { success, error } = useMigrations(db, migrations);
  const [isSeeded, setIsSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);

  useEffect(() => {
    if (!success) return;
    seed(db)
      .then(() => setIsSeeded(true))
      .catch((e) => setSeedError(e));
  }, [success]);

  if (error || seedError) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive text-center">
          Database error: {(error || seedError)?.message}
        </Text>
      </View>
    );
  }

  if (!success || !isSeeded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ db, isReady: true }}>
      {children}
    </DatabaseContext.Provider>
  );
}
