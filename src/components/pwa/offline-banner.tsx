"use client";

import { useOffline } from "next/offline";

/**
 * `useOffline` beats `navigator.onLine`: it also flips when a navigation,
 * prefetch, or Server Action fetch actually fails, so a WiFi connection with
 * no upstream internet is still reported as offline.
 */
export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      style={{ viewTransitionName: "offline-banner" }}
      aria-live="polite"
      className="bg-brand-charcoal animate-in slide-in-from-top fade-in duration-brisk sticky top-0 z-60 px-4 py-2 text-center text-sm text-white"
    >
      You&rsquo;re offline. Pending actions will retry once you reconnect.
    </div>
  );
}
