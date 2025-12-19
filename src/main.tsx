import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './styles/animations.css';

// Apply reduced motion setting ASAP (before first render) to avoid animation flashes.
try {
  const raw = localStorage.getItem('lotus_user_settings');
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
