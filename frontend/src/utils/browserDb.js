const DB_NAME = "shonstudio-browser-db";
const DB_VERSION = 1;
const RESPONSE_STORE = "api-response-cache";

let dbPromise = null;

const isBrowserDbSupported = () =>
  typeof window !== "undefined" && typeof window.indexedDB !== "undefined";

const toRequestPromise = (request) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error || new Error("IndexedDB request failed"));
  });

const openBrowserDb = async () => {
  if (!isBrowserDbSupported()) {
    return null;
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(RESPONSE_STORE)) {
          database.createObjectStore(RESPONSE_STORE, {
            keyPath: "key",
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Unable to open IndexedDB"));
    }).catch((error) => {
      console.warn("[BrowserDB] Falling back to in-memory cache only.", error);
      dbPromise = null;
      return null;
    });
  }

  return dbPromise;
};

const getStore = async (mode) => {
  const database = await openBrowserDb();

  if (!database) {
    return null;
  }

  return database.transaction(RESPONSE_STORE, mode).objectStore(RESPONSE_STORE);
};

export const readCachedApiResponse = async (key) => {
  const store = await getStore("readonly");

  if (!store) {
    return null;
  }

  try {
    return await toRequestPromise(store.get(key));
  } catch {
    return null;
  }
};

export const writeCachedApiResponse = async (key, data) => {
  const store = await getStore("readwrite");

  if (!store) {
    return;
  }

  try {
    await toRequestPromise(
      store.put({
        key,
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // Ignore cache persistence failures and continue serving live data.
  }
};

export const deleteCachedApiResponse = async (key) => {
  const store = await getStore("readwrite");

  if (!store) {
    return;
  }

  try {
    await toRequestPromise(store.delete(key));
  } catch {
    // Ignore cache cleanup failures.
  }
};
