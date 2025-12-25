import { useEffect, useState } from 'react';
import { readUserScopedStorage } from '../utils/userStorage';

const SETTINGS_STORAGE_KEY = 'lotus_user_settings';

function getUserReducedMotionSetting(): boolean {
  try {
    const dataset = document.documentElement?.dataset?.reducedMotion;
    if (dataset === 'true') return true;

    const raw = readUserScopedStorage(SETTINGS_STORAGE_KEY);
    if (!raw) return false;
    return Boolean(JSON.parse(raw)?.display?.reducedMotion);
  } catch {
    return false;
  }
}

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    const system = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
    return system || getUserReducedMotionSetting();
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mediaQuery.matches || getUserReducedMotionSetting());

    update();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', update);
      return () => mediaQuery.removeEventListener('change', update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      const system = typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
      setPrefersReducedMotion(system || getUserReducedMotionSetting());
    };

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === SETTINGS_STORAGE_KEY || event.key.startsWith(`${SETTINGS_STORAGE_KEY}:`)) {
        update();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('lotus-settings-changed', update);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('lotus-settings-changed', update);
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
