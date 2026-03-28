/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CULTUREWORKS_EVENTS_URL?: string;
  readonly VITE_DEFAULT_EVENT_IMAGE_URL?: string;
  readonly VITE_EVENT_TIMEZONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
