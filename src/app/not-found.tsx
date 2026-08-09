import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section spacing="spacious">
      <Container width="content">
        <h1 className="text-3xl font-medium">Not found</h1>
        <p className="text-muted-foreground mt-3">
          That tier, level, or page doesn&rsquo;t exist — it may have been
          renamed or deleted.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to the flashcards</Link>
        </Button>
      </Container>
    </Section>
  );
}
