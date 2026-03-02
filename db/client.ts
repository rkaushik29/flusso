import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

// Lazily initialize to avoid crashing on web (SharedArrayBuffer not available)
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const expo = openDatabaseSync("flusso.db", {
      enableChangeListener: true,
    });
    _db = drizzle(expo, { schema });
  }
  return _db;
}

// Proxy that lazily initializes on first access
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
