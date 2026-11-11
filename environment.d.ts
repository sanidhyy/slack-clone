// This file is needed to support autocomplete for process.env
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // convex public url and site url
      NEXT_PUBLIC_CONVEX_URL: string;
      NEXT_PUBLIC_CONVEX_SITE_URL: string;
    }
  }
}
