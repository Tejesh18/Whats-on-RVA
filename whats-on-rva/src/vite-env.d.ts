/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CULTUREWORKS_EVENTS_URL?: string;
  readonly VITE_DEFAULT_EVENT_IMAGE_URL?: string;
  readonly VITE_EVENT_TIMEZONE?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_LEGAL_ENTITY?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  /** HTTPS base URL of your serverless proxy to Eventbrite API v3 (production). */
  readonly VITE_EVENTBRITE_PROXY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
