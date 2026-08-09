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
import {
  createContentPack,
  createWord,
  deleteContentPack,
  deleteWord,
  updateContentPack,
  updateWord,
} from "../../actions";
import { errorMessage, routeId } from "../../params";

/** "No pack" is the level's own content set — the null `contentPackId`. */
const NO_PACK = "";

export default async function AdminLevel({
  params,
  searchParams,
}: PageProps<"/admin/levels/[levelId]">) {
  await requireAdmin();

  const id = routeId((await params).levelId);

  const level = await db.level.findUnique({
    where: { id },
    include: {
      tier: true,
      contentPacks: { orderBy: { position: "asc" } },
      words: { orderBy: { position: "asc" } },
    },
  });

  if (!level) notFound();

  const packOptions = [
    { value: NO_PACK, label: "No pack (level's own set)" },
    ...level.contentPacks.map((pack) => ({
      value: String(pack.id),
      label: `${pack.name} (id ${pack.id})`,
    })),
  ];

  /** Words grouped by the content set they belong to. */
  const groups = [
    {
      key: NO_PACK,
      heading: "Words with no pack",
      packId: null as number | null,
      words: level.words.filter((word) => word.contentPackId === null),
    },
    ...level.contentPacks.map((pack) => ({
      key: String(pack.id),
      heading: `${pack.name} · id ${pack.id}`,
      packId: pack.id,
      words: level.words.filter((word) => word.contentPackId === pack.id),
    })),
  ];

  return (
    <>
      <ErrorBanner message={errorMessage(await searchParams)} />

      <header className="mb-8">
        <Link
          href={`/admin/tiers/${level.tierId}`}
          className="text-muted-foreground text-sm"
        >
          ← {level.tier.name}
        </Link>
        <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-medium">
          <Swatch colour={level.colour} />
          {level.name}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          id {level.id} · {level.contentPacks.length} packs ·{" "}
          {level.words.length} words
        </p>
      </header>

      <Panel
        title="Content packs"
        description="Parallel word sets at the same mastery level. A level with none shows the learner no selector."
      >
        <div className="space-y-4">
          {level.contentPacks.map((pack) => (
            <form
              key={pack.id}
              action={updateContentPack}
              className="grid items-end gap-3 sm:grid-cols-[1fr_6rem_auto_auto]"
            >
              <input type="hidden" name="id" value={pack.id} />
              <input type="hidden" name="levelId" value={level.id} />
              <Field label="Name" name="name" defaultValue={pack.name} required />
              <Field
                label="Position"
                name="position"
                type="number"
                min={1}
                defaultValue={pack.position}
                required
              />
              <Button type="submit" size="sm" variant="outline">
                Save
              </Button>
              <Button
                type="submit"
                size="sm"
                variant="destructive"
                formAction={deleteContentPack}
              >
                Delete pack and{" "}
                {level.words.filter((w) => w.contentPackId === pack.id).length}{" "}
                words
              </Button>
            </form>
          ))}

          <form action={createContentPack} className="flex items-end gap-3">
            <input type="hidden" name="levelId" value={level.id} />
            <Field
              label="New pack name"
              name="name"
              placeholder={`Pack ${level.contentPacks.length + 1}`}
              className="max-w-xs"
            />
            <Button type="submit" size="sm">
              Add pack
            </Button>
          </form>
        </div>
      </Panel>

      <Panel title="Add a word" className="mt-6">
        <form action={createWord} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="levelId" value={level.id} />
          <Field label="Hebrew" name="hebrew" dir="rtl" required />
          <Field label="English" name="english" required />
          <Field label="Transliteration" name="transliteration" />
          <Field label="Note" name="note" />
          <SelectField
            label="Content pack"
            name="contentPackId"
            options={packOptions}
          />
          <div className="flex items-end">
            <Button type="submit" size="sm">
              Add word
            </Button>
          </div>
        </form>
      </Panel>

      {groups.map((group) =>
        group.words.length === 0 && group.packId === null ? null : (
          <Panel
            key={group.key}
            title={group.heading}
            description={`${group.words.length} words`}
            className="mt-6"
          >
            <ul className="space-y-3">
              {group.words.map((word) => (
                <li key={word.id}>
                  <form
                    action={updateWord}
                    className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_1fr_5rem_auto_auto]"
                  >
                    <input type="hidden" name="id" value={word.id} />
                    <input type="hidden" name="levelId" value={level.id} />
                    <Field
                      label="Hebrew"
                      name="hebrew"
                      dir="rtl"
                      defaultValue={word.hebrew}
                      required
                    />
                    <Field
                      label="English"
                      name="english"
                      defaultValue={word.english}
                      required
                    />
                    <SelectField
                      label="Pack"
                      name="contentPackId"
                      options={packOptions}
                      defaultValue={
                        word.contentPackId === null
                          ? NO_PACK
                          : String(word.contentPackId)
                      }
                    />
                    <Field
                      label="Position"
                      name="position"
                      type="number"
                      min={1}
                      defaultValue={word.position}
                      required
                    />
                    <Button type="submit" size="sm" variant="outline">
                      Save
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      variant="destructive"
                      formAction={deleteWord}
                    >
                      Delete
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          </Panel>
        ),
      )}
    </>
  );
}
