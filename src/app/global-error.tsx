"use client";

/**
 * Last resort: the root layout itself failed, so there are no fonts, no tokens,
 * and no shared chrome. Everything here is inline and self-contained.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F2F1EC",
          color: "#373230",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <main style={{ maxWidth: "28rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>
            Citizen Café is temporarily unavailable
          </h1>
          <p style={{ marginTop: "0.75rem", lineHeight: 1.55 }}>
            Something failed before the page could be built.
          </p>
          {error.digest ? (
            <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1rem",
              border: 0,
              borderRadius: "0.5rem",
              background: "#F9E24C",
              color: "#373230",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
