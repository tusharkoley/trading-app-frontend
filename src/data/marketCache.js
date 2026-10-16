import { QueryClient } from "@tanstack/react-query";
import ServerURL from "./config";

export const MARKET_STALE_TIME = 12 * 60 * 60 * 1000;
const RETENTION = 7 * 24 * 60 * 60 * 1000;
const persistedKeys = new Set([
  "fetchSnp500Stocks", "fetchLatestTechnicals", "fetchLatestPrices",
  "industryPerformanceRankings",
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Only public market responses are stored; namespace by API to isolate environments.
const database = new Promise((resolve) => {
  try {
    const request = indexedDB.open("tradezen-market-v1", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("queries", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  } catch {
    resolve(null); // Private browsing/storage restrictions must not block the app.
  }
});

export async function restoreMarketCache() {
  const db = await database;
  if (!db) return;
  await new Promise((resolve) => {
    try {
      const store = db.transaction("queries", "readwrite").objectStore("queries");
      const request = store.getAll();
      request.onsuccess = () => {
        for (const entry of request.result) {
          if (Date.now() - entry.updatedAt > RETENTION) {
            store.delete(entry.id);
          } else if (entry.server === ServerURL && persistedKeys.has(entry.key?.[0])) {
            const current = queryClient.getQueryState(entry.key);
            if (!current || current.dataUpdatedAt < entry.updatedAt) {
              queryClient.setQueryData(entry.key, entry.data, { updatedAt: entry.updatedAt });
            }
          }
        }
        resolve();
      };
      request.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

queryClient.getQueryCache().subscribe((event) => {
  if (event.type !== "updated" || event.action.type !== "success" ||
      !persistedKeys.has(event.query.queryKey[0])) return;
  const { queryKey: key, state } = event.query;
  void database.then((db) => {
    if (!db) return;
    try {
      const transaction = db.transaction("queries", "readwrite");
      transaction.onerror = () => {}; // Quota failures leave the in-memory cache usable.
      transaction.objectStore("queries").put({
        id: JSON.stringify([ServerURL, key]), server: ServerURL, key,
        data: state.data, updatedAt: state.dataUpdatedAt,
      });
    } catch { /* Storage is an optional optimization. */ }
  });
});
