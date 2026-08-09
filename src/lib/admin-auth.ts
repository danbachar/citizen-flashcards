/**
 * A shared secret in `ADMIN_PASSWORD`, exchanged for an httpOnly cookie. A gate,
 * not an identity system: no accounts, no roles, no audit trail. With no
 * password set the dashboard is open locally and absent everywhere else, so a
 * missing config fails closed.
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { deployEnv } from "@/lib/env";

export const ADMIN_COOKIE = "citizen_admin";

/** A week. */
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** "open" = no password locally; "disabled" = no password when deployed. */
export type AdminAccess =
  | "open"
  | "disabled"
  | "authenticated"
  | "unauthenticated";

/** Cookie value for a password — never the password itself. */
export function adminToken(password: string): string {
  return createHash("sha256").update(`citizen-admin:${password}`).digest("hex");
}

/** Constant-time, so a wrong cookie leaks nothing through timing. */
function matches(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function adminAccess(): Promise<AdminAccess> {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) return deployEnv === "development" ? "open" : "disabled";

  const cookie = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!cookie) return "unauthenticated";

  return matches(cookie, adminToken(password))
    ? "authenticated"
    : "unauthenticated";
}

/** Call first, before reading form data or touching the database. */
export async function requireAdmin(): Promise<void> {
  const access = await adminAccess();

  // 404 rather than 403: an unconfigured dashboard should not advertise itself.
  if (access === "disabled") notFound();
  if (access === "unauthenticated") redirect("/admin/login");
}
