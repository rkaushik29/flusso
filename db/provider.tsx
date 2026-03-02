import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import React, { createContext, useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { db } from "./client";
import migrations from "./migrations/migrations";

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

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-destructive text-center">
          Database error: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
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
