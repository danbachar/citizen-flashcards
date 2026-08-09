"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

/**
 * Catches render and Server Action failures below the root layout — including
 * the admin deletes, which do not validate and so surface real database errors
 * here rather than as a message on the form.
 */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section spacing="spacious">
      <Container width="content">
        <h1 className="text-3xl font-medium">Something went wrong</h1>
        <p className="text-muted-foreground mt-3">
          The page could not be loaded. Trying again often works — the database
          may have been briefly unreachable.
        </p>
        {error.digest ? (
          <p className="text-muted-foreground mt-2 font-mono text-xs">
            Reference: {error.digest}
          </p>
        ) : null}
        <Button className="mt-6" onClick={() => retry()}>
          Try again
        </Button>
      </Container>
    </Section>
  );
}
