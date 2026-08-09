import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  // One query, purely to prove the Postgres → Prisma → render path works.
  // There are no models yet, so this goes straight to the driver.
  await db.$queryRaw`SELECT 1`;

  return (
    <Section spacing="regular">
      <Container width="content">
        <h1 className="text-3xl font-medium">Citizen Café</h1>
        <p className="text-muted-foreground mt-3 text-sm tabular-nums">
          Database connected.
        </p>
      </Container>
    </Section>
  );
}
