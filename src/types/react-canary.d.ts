/**
 * `<ViewTransition>` and `addTransitionType` ship in the React build Next
 * vendors for the App Router, but `@types/react` keeps their declarations in
 * `canary.d.ts`, which the default `types` resolution does not pull in.
 *
 * This reference pulls in React's own declarations — do not hand-write a
 * substitute. A partial copy silently blesses prop misuse the real types catch.
 */
/// <reference types="react/canary" />
