import Link from "next/link";
import {
  CheckboxField,
  ErrorBanner,
  Field,
  Panel,
  Swatch,
} from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { createTier, deleteTier, updateTier } from "./actions";
import { errorMessage } from "./params";

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();

  const tiers = await db.tier.findMany({
    orderBy: { position: "asc" },
    include: {
      levels: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          name: true,
          colour: true,
          _count: { select: { words: true, contentPacks: true } },
        },
      },
    },
  });

  return (
    <>
      <ErrorBanner message={errorMessage(await searchParams)} />

      <header className="mb-8">
        <h1 className="text-2xl font-medium">Tiers</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          The progression, in order. Levels live inside a tier; a tier that
          splits its levels into content packs is marked below.
        </p>
      </header>

      <div className="space-y-6">
        {tiers.map((tier) => {
          const words = tier.levels.reduce(
            (total, level) => total + level._count.words,
            0,
          );

          return (
            <Panel
              key={tier.id}
              title={tier.name}
              description={`${tier.levels.length} levels · ${words} words · id ${tier.id}`}
            >
              <form
                action={updateTier}
                className="grid gap-4 sm:grid-cols-[1fr_6rem]"
              >
                <input type="hidden" name="id" value={tier.id} />
                <Field label="Name" name="name" defaultValue={tier.name} required />
                <Field
                  label="Position"
                  name="position"
                  type="number"
                  min={1}
                  defaultValue={tier.position}
                  required
                />

                <div className="sm:col-span-2">
                  <CheckboxField
                    label="Levels in this tier have content packs"
                    name="hasContentPacks"
                    defaultChecked={tier.hasContentPacks}
                    hint="Whether this tier may split its levels into packs. Never inferred from the tier's name."
                  />
                </div>

                <div className="flex items-center gap-2 sm:col-span-2">
                  <Button type="submit" size="sm">
                    Save tier
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/tiers/${tier.id}`}>
                      Levels ({tier.levels.length})
                    </Link>
                  </Button>
                </div>
              </form>

              {tier.levels.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {tier.levels.map((level) => (
                    <li key={level.id}>
                      <Link
                        href={`/admin/levels/${level.id}`}
                        className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors"
                      >
                        <Swatch colour={level.colour} />
                        {level.name}
                        <span className="text-muted-foreground">
                          {level._count.contentPacks > 0
                            ? `${level._count.contentPacks} packs`
                            : `${level._count.words} words`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}

              <form action={deleteTier} className="mt-5">
                <input type="hidden" name="id" value={tier.id} />
                <Button type="submit" variant="destructive" size="sm">
                  Delete tier, {tier.levels.length} levels and {words} words
                </Button>
              </form>
            </Panel>
          );
        })}
      </div>

      <Panel
        title="Add a tier"
        description="Appended to the end of the progression; reorder with the position field."
        className="mt-10"
      >
        <form action={createTier} className="grid gap-4">
          <Field label="Name" name="name" placeholder="Fluency" required />
          <div className="sm:col-span-2">
            <CheckboxField
              label="Levels in this tier have content packs"
              name="hasContentPacks"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm">
              Create tier
            </Button>
          </div>
        </form>
      </Panel>
    </>
  );
}
