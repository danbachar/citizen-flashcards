import { redirect } from "next/navigation";
import { ErrorBanner, Field, Panel } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { adminAccess } from "@/lib/admin-auth";
import { errorMessage } from "../params";
import { signIn } from "../session-actions";

export default async function AdminLogin({
  searchParams,
}: PageProps<"/admin/login">) {
  const access = await adminAccess();

  // Nothing to log in to: either the gate is off, or the route does not exist
  // here at all. `requireAdmin` on the pages themselves handles the latter.
  if (access !== "unauthenticated") redirect("/admin");


  return (
    <div className="mx-auto max-w-sm">
      <ErrorBanner message={errorMessage(await searchParams)} />
      <Panel
        title="Sign in"
        description="The dashboard is behind a shared password set in ADMIN_PASSWORD."
      >
        <form action={signIn} className="space-y-4">
          <Field label="Password" name="password" type="password" required />
          <Button type="submit">Sign in</Button>
        </form>
      </Panel>
    </div>
  );
}
