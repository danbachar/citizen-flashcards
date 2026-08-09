import Link from "next/link";
import { Button } from "@/components/ui/button";
import { adminAccess } from "@/lib/admin-auth";
import { signOut } from "./session-actions";

export const metadata = {
  title: "Admin — Citizen Café",
  // The dashboard must never appear in search results, even if the URL leaks.
  robots: { index: false, follow: false },
};

/** The admin surface is always live: it is the editor's view of the database. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const access = await adminAccess();

  return (
    <div className="min-h-full">
      <header className="border-border bg-surface-raised sticky top-0 z-40 border-b">
        <div className="mx-auto flex max-w-page items-center gap-4 px-6 py-3">
          <Link href="/admin" className="text-sm font-medium">
            Curriculum admin
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Learner view</Link>
            </Button>
            {access === "authenticated" ? (
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-page px-6 py-10">{children}</div>
    </div>
  );
}
