type StoredUserState = {
  user?: {
    id?: string;
  };
};

const USER_STATE_STORAGE_KEY = 'lotus_user_state';

export const getStoredUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_STATE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUserState;
    const id = parsed?.user?.id;
    if (typeof id !== 'string') return null;
    const trimmed = id.trim();
    return trimmed ? trimmed : null;
  } catch {
    return null;
  }
};

export const getUserScopedKey = (baseKey: string, userId?: string | null): string => {
  const id = typeof userId === 'string' ? userId.trim() : '';
  return id ? `${baseKey}:${id}` : baseKey;
};

export const readUserScopedStorage = (baseKey: string, userId?: string | null): string | null => {
  if (typeof window === 'undefined') return null;
  const resolvedUserId = userId ?? getStoredUserId();
  const scopedKey = getUserScopedKey(baseKey, resolvedUserId);
  try {
    const scopedValue = window.localStorage.getItem(scopedKey);
    if (scopedValue !== null) return scopedValue;
    if (resolvedUserId && scopedKey !== baseKey) {
      const legacyValue = window.localStorage.getItem(baseKey);
      if (legacyValue !== null) {
        window.localStorage.setItem(scopedKey, legacyValue);
        return legacyValue;
      }
    }
  } catch {
    return null;
  }
  return null;
};

export const writeUserScopedStorage = (baseKey: string, value: string, userId?: string | null): void => {
  if (typeof window === 'undefined') return;
  const resolvedUserId = userId ?? getStoredUserId();
  const scopedKey = getUserScopedKey(baseKey, resolvedUserId);
  try {
    window.localStorage.setItem(scopedKey, value);
  } catch {
    // Ignore storage errors.
  }
};
