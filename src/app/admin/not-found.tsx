import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The root `not-found.tsx` handles unmatched URLs, but a `notFound()` thrown
 * inside this segment needs a boundary here — without one the admin layout
 * renders with an empty body.
 */
export default function AdminNotFound() {
  return (
    <div className="py-10">
      <h1 className="text-2xl font-medium">Not found</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        That tier or level doesn&rsquo;t exist. It may have been deleted, or the
        id in the URL is wrong.
      </p>
      <Button asChild size="sm" className="mt-6">
        <Link href="/admin">Back to tiers</Link>
      </Button>
    </div>
  );
}
