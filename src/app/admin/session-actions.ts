"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminToken,
} from "@/lib/admin-auth";
import { isProduction } from "@/lib/env";

export async function signIn(formData: FormData) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) redirect("/admin");

  const submitted = formData.get("password");
  if (submitted !== password) {
    redirect(`/admin/login?error=${encodeURIComponent("Incorrect password.")}`);
  }

  (await cookies()).set(ADMIN_COOKIE, adminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect("/admin");
}

export async function signOut() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
