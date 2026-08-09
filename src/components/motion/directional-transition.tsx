import { ViewTransition } from "react";

/**
 * Hierarchical page transition: content slides left going deeper, right coming
 * back. Wrap the *page* body in this — layouts persist across navigations, so
 * enter/exit would never fire there.
 *
 * The direction comes from the transition type set by the navigating `<Link>`
 * (`transitionTypes={["nav-forward"]}`). `default: "none"` keeps it silent for
 * Suspense reveals and background revalidation.
 */
export function DirectionalTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
