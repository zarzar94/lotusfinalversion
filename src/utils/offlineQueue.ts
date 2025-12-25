export type OfflineQueueItem = {
  id: string;
  endpoint: string;
  method: string;
  body?: unknown;
  timestamp: number;
  baseUrl: string;
  token?: string | null;
  userId?: string | null;
  skipAuth?: boolean;
};

const DB_NAME = 'lotus_offline_queue_db';
const STORE_NAME = 'offline_queue';
const DB_VERSION = 1;

const openQueueDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open offline queue DB'));
  });
};

const runTransaction = async <T>(
  mode: IDBTransactionMode,
  runner: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T | undefined> => {
  const db = await openQueueDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const request = runner(store);

    tx.oncomplete = () => resolve(request ? (request.result as T) : undefined);
    tx.onerror = () => reject(tx.error ?? new Error('Offline queue transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('Offline queue transaction aborted'));
  });
};

const getAllItems = async (): Promise<OfflineQueueItem[]> => {
  try {
    const result = await runTransaction<OfflineQueueItem[]>('readonly', (store) => store.getAll());
    return Array.isArray(result) ? result : [];
  } catch {
    return [];
  }
};

export const getOfflineQueueItems = async (userId?: string | null): Promise<OfflineQueueItem[]> => {
  const all = await getAllItems();
  const filtered = userId ? all.filter((item) => item.userId === userId) : all;
  return filtered.sort((a, b) => a.timestamp - b.timestamp);
};

export const addOfflineQueueItems = async (items: OfflineQueueItem[]): Promise<void> => {
  if (items.length === 0) return;
  try {
    await runTransaction('readwrite', (store) => {
      items.forEach((item) => store.put(item));
    });
  } catch {
    // Ignore storage errors.
  }
};

export const overwriteOfflineQueueItems = async (items: OfflineQueueItem[]): Promise<void> => {
  try {
    await runTransaction('readwrite', (store) => {
      store.clear();
      items.forEach((item) => store.put(item));
    });
  } catch {
    // Ignore storage errors.
  }
};

export const replaceOfflineQueueItemsForUser = async (
  userId: string | null | undefined,
  items: OfflineQueueItem[]
): Promise<void> => {
  const all = await getAllItems();
  const remaining = userId ? all.filter((item) => item.userId !== userId) : [];
  const merged = [...remaining, ...items];
  await overwriteOfflineQueueItems(merged);
};
