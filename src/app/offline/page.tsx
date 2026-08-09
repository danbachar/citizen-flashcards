import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export const metadata = { title: "Offline — Citizen Café" };

/**
 * Served by the service worker when a navigation fails with nothing cached.
 * Must render without any data, so it stays fully static.
 */
export default function Offline() {
  return (
    <Section spacing="spacious">
      <Container width="content" className="text-center">
        <span
          aria-hidden
          className="bg-brand-yellow mx-auto block size-12 rounded-full"
        />
        <h1 className="mt-8 text-4xl font-medium">You&rsquo;re offline</h1>
        <p className="text-muted-foreground mt-4">
          This page hasn&rsquo;t been saved to your device yet. Pages you have
          already visited stay available — reconnect to load the rest.
        </p>
      </Container>
    </Section>
  );
}
