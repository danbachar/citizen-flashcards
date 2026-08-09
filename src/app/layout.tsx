import type { Metadata, Viewport } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import { OfflineBanner } from "@/components/pwa/offline-banner";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

// Assistant = system: nav, forms, buttons, body copy, metadata.
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  display: "swap",
});

// Stand-in for Fedra (licensed) = voice: headlines and editorial moments.
const fedraFallback = Frank_Ruhl_Libre({
  variable: "--font-fedra-fallback",
  subsets: ["latin", "hebrew"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Citizen Café",
  description: "Sparking belonging through language, culture, and people.",
  applicationName: "Citizen Café",
  appleWebApp: { capable: true, title: "Citizen", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  // `viewport-fit=cover` lets layouts paint under the notch; use
  // `env(safe-area-inset-*)` on anything pinned to an edge.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2F1EC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${assistant.variable} ${fedraFallback.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <OfflineBanner />
        <main id="main" className="flex-1">
          {children}
        </main>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
