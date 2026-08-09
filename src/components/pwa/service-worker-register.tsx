"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production only — a live SW in dev serves
 * stale bundles and makes HMR confusing.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {
          // Registration failing is not fatal — the app still works online.
        });
    };

    // Wait for load so the SW install never competes with the first paint.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
