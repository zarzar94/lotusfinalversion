let storageAvailable: boolean | null = null;

const isStorageAvailable = () => {
  if (storageAvailable !== null) return storageAvailable;
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      storageAvailable = false;
      return storageAvailable;
    }
    const testKey = '__lotus_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
    return storageAvailable;
  } catch {
    storageAvailable = false;
    return storageAvailable;
  }
};

const getStorage = () => {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const safeStorage = {
  isAvailable: isStorageAvailable,
  getItem: (key: string) => {
    const storage = getStorage();
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    const storage = getStorage();
    if (!storage) return false;
    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  removeItem: (key: string) => {
    const storage = getStorage();
    if (!storage) return false;
    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};
