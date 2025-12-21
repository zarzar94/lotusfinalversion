/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLINIC_PHONE?: string;
  readonly VITE_CLINIC_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// WebKit AudioContext for Safari compatibility
interface Window {
  webkitAudioContext?: typeof AudioContext;
}
