import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { processOfflineQueue } from './services/api';
import { readUserScopedStorage } from './utils/userStorage';
import './styles/animations.css';
import './components/labui/labui.css';

// Apply reduced motion setting ASAP (before first render) to avoid animation flashes.
try {
  const raw = readUserScopedStorage('lotus_user_settings');
  const reducedMotion = raw ? Boolean(JSON.parse(raw)?.display?.reducedMotion) : false;
  if (reducedMotion) {
    document.documentElement.dataset.reducedMotion = 'true';
  }
} catch {
  // Ignore storage/parse errors.
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Missing root element: #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  const base = import.meta.env.BASE_URL || '/';
  const swUrl = base.endsWith('/') ? `${base}sw.js` : `${base}/sw.js`;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch(() => {});
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type !== 'SYNC_OFFLINE_QUEUE') return;
    processOfflineQueue()
      .catch(() => {})
      .finally(() => {
        const port = event.ports?.[0];
        if (port) {
          port.postMessage({ ok: true });
        }
      });
  });
}
