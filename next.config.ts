import type { NextConfig } from "next";

/**
 * Cache-busting stamp for the service worker, inlined into the client bundle.
 * The page registers `/sw.js?v=<stamp>` and the worker reads it back as its
 * cache namespace, so each deploy retires the previous one's caches.
 */
const swVersion =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ?? `local-${Date.now()}`;

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_SW_VERSION: swVersion },
  experimental: {
    // Failed navigations, RSC fetches, and Server Actions stay pending and
    // retry when the connection returns, instead of throwing. Powers the
    // `useOffline` hook used by the offline banner.
    useOffline: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // The service worker itself must never be cached, or clients get
        // stuck on an old version and stale precache manifests.
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
