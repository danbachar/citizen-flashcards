import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ErrorBanner,
  Field,
  Panel,
  SelectField,
  Swatch,
} from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { createLevel, deleteLevel, updateLevel } from "../../actions";
import { errorMessage, routeId } from "../../params";

export default async function AdminTier({
  params,
  searchParams,
}: PageProps<"/admin/tiers/[tierId]">) {
  await requireAdmin();

  const id = routeId((await params).tierId);

  const [tier, tiers] = await Promise.all([
    db.tier.findUnique({
      where: { id },
      include: {
        levels: {
          orderBy: { position: "asc" },
          include: { _count: { select: { words: true, contentPacks: true } } },
        },
      },
    }),
    db.tier.findMany({ orderBy: { position: "asc" } }),
  ]);

  if (!tier) notFound();

  return (
    <>
      <ErrorBanner message={errorMessage(await searchParams)} />

      <header className="mb-8">
        <Link href="/admin" className="text-muted-foreground text-sm">
          ← All tiers
        </Link>
        <h1 className="mt-2 text-2xl font-medium">{tier.name} levels</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {tier.hasContentPacks
            ? "This tier splits its levels into content packs."
            : "This tier has one content set per level."}
        </p>
      </header>

      <div className="space-y-6">
        {tier.levels.map((level) => (
          <Panel
            key={level.id}
            title={level.name}
            description={`${level._count.contentPacks} packs · ${level._count.words} words · id ${level.id}`}
          >
            <form
              action={updateLevel}
              className="grid gap-4 sm:grid-cols-[1fr_8rem_6rem]"
            >
              <input type="hidden" name="id" value={level.id} />
              <input type="hidden" name="tierId" value={tier.id} />
              <Field label="Name" name="name" defaultValue={level.name} required />
              <Field
                label="Colour"
                name="colour"
                type="color"
                defaultValue={level.colour}
                required
              />
              <Field
                label="Position"
                name="position"
                type="number"
                min={1}
                defaultValue={level.position}
                required
              />

              <SelectField
                label="Tier"
                name="moveToTierId"
                defaultValue={String(tier.id)}
                options={tiers.map((option) => ({
                  value: String(option.id),
                  label: option.name,
                }))}
                className="sm:col-span-2"
              />

              <div className="flex items-end gap-2 sm:col-span-2">
                <Button type="submit" size="sm">
                  Save level
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/levels/${level.id}`}>Packs and words</Link>
                </Button>
              </div>
            </form>

            <form action={deleteLevel} className="mt-5">
              <input type="hidden" name="id" value={level.id} />
              <input type="hidden" name="tierId" value={tier.id} />
              <Button type="submit" variant="destructive" size="sm">
                Delete level and {level._count.words} words
              </Button>
            </form>
          </Panel>
        ))}

        {tier.levels.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No levels yet. Add the first one below.
          </p>
        ) : null}
      </div>

      <Panel title="Add a level" className="mt-10">
        <form action={createLevel} className="grid gap-4 sm:grid-cols-3">
          <input type="hidden" name="tierId" value={tier.id} />
          <Field label="Name" name="name" placeholder="Crimson" required />
          <Field
            label="Colour"
            name="colour"
            type="color"
            defaultValue="#B3ACA6"
            required
          />
          <div className="sm:col-span-3">
            <Button type="submit" size="sm">
              Create level
            </Button>
          </div>
        </form>
      </Panel>

      {tier.levels.length > 0 ? (
        <p className="text-muted-foreground mt-6 flex flex-wrap items-center gap-2 text-xs">
          {tier.levels.map((level) => (
            <span key={level.id} className="inline-flex items-center gap-1.5">
              <Swatch colour={level.colour} />
              {level.colour}
            </span>
          ))}
        </p>
      ) : null}
    </>
  );
}
