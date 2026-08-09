"use server";

/**
 * Curriculum CRUD. Each action re-checks access first: an action is a public
 * endpoint, so guarding only the page would leave the mutation open. Failures
 * redirect back with `?error=` rather than throwing, which keeps the forms
 * working without client JavaScript.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

function formText(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function formTextOrNull(form: FormData, key: string): string | null {
  return formText(form, key) || null;
}

function formInt(form: FormData, key: string): number | null {
  const raw = formText(form, key);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isInteger(value) ? value : null;
}

function formId(form: FormData, key: string): number {
  const value = formInt(form, key);
  if (value === null) throw new Error(`Missing or invalid "${key}"`);
  return value;
}

function formFlag(form: FormData, key: string): boolean {
  return form.get(key) !== null;
}

/** Back to the page that submitted, with a readable message. */
function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

/**
 * Ends every successful action. The redirect is not cosmetic: forms post back
 * to the URL they were rendered at, so without it a save made from
 * `/admin?error=…` would re-render with the old error still showing.
 */
function done(path: string): never {
  // The learner picker reads this data too.
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
  redirect(path);
}

/**
 * Turns Prisma's unique-constraint violation into a message on the page.
 * Anything else is a real fault and keeps propagating.
 */
async function unique<T>(
  path: string,
  message: string,
  write: () => Promise<T>,
): Promise<T> {
  try {
    return await write();
  } catch (error) {
    const conflict =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: unknown }).code === "P2002";

    if (conflict) fail(path, message);
    throw error;
  }
}

const HEX_COLOUR = /^#[0-9a-fA-F]{6}$/;

/* Tiers */

export async function createTier(formData: FormData) {
  await requireAdmin();

  const name = formText(formData, "name");
  if (!name) fail("/admin", "A tier needs a name.");

  // Append to the end; positions are edited afterwards.
  const last = await db.tier.findFirst({ orderBy: { position: "desc" } });

  await unique("/admin", `Another tier is already called "${name}".`, () =>
    db.tier.create({
      data: {
        name,
        position: (last?.position ?? 0) + 1,
        hasContentPacks: formFlag(formData, "hasContentPacks"),
      },
    }),
  );

  done("/admin");
}

export async function updateTier(formData: FormData) {
  await requireAdmin();

  const id = formId(formData, "id");
  const name = formText(formData, "name");
  const position = formInt(formData, "position");

  if (!name) fail("/admin", "A tier needs a name.");
  if (position === null) fail("/admin", "Position must be a whole number.");

  await unique(
    "/admin",
    "Another tier already uses that name or position.",
    () =>
      db.tier.update({
        where: { id },
        data: {
          name,
          position,
          hasContentPacks: formFlag(formData, "hasContentPacks"),
        },
      }),
  );

  done("/admin");
}

export async function deleteTier(formData: FormData) {
  await requireAdmin();

  await db.tier.delete({ where: { id: formId(formData, "id") } });
  done("/admin");
}

/* Levels */

export async function createLevel(formData: FormData) {
  await requireAdmin();

  const tierId = formId(formData, "tierId");
  const path = `/admin/tiers/${tierId}`;

  const name = formText(formData, "name");
  const colour = formText(formData, "colour");

  if (!name) fail(path, "A level needs a name.");
  if (!HEX_COLOUR.test(colour)) {
    fail(path, "Colour must be a hex value like #4B4B9E.");
  }

  const last = await db.level.findFirst({
    where: { tierId },
    orderBy: { position: "desc" },
  });

  await unique(path, `Another level is already called "${name}".`, () =>
    db.level.create({
      data: { tierId, name, colour, position: (last?.position ?? 0) + 1 },
    }),
  );

  done(path);
}

export async function updateLevel(formData: FormData) {
  await requireAdmin();

  const id = formId(formData, "id");
  const tierId = formId(formData, "tierId");
  const path = `/admin/tiers/${tierId}`;

  const name = formText(formData, "name");
  const colour = formText(formData, "colour");
  const position = formInt(formData, "position");

  if (!name) fail(path, "A level needs a name.");
  if (!HEX_COLOUR.test(colour)) {
    fail(path, "Colour must be a hex value like #4B4B9E.");
  }
  if (position === null) fail(path, "Position must be a whole number.");

  const destination = formInt(formData, "moveToTierId") ?? tierId;

  await unique(
    path,
    "Another level already uses that name, or that position in the tier.",
    () =>
      db.level.update({
        where: { id },
        data: {
          name,
          colour,
          position,
          tierId: destination,
        },
      }),
  );

  // Follow the level if it moved, rather than landing on a page it just left.
  done(`/admin/tiers/${destination}`);
}

export async function deleteLevel(formData: FormData) {
  await requireAdmin();

  const tierId = formId(formData, "tierId");
  await db.level.delete({ where: { id: formId(formData, "id") } });
  done(`/admin/tiers/${tierId}`);
}

/* Content packs */

export async function createContentPack(formData: FormData) {
  await requireAdmin();

  const levelId = formId(formData, "levelId");
  const path = `/admin/levels/${levelId}`;

  const last = await db.contentPack.findFirst({
    where: { levelId },
    orderBy: { position: "desc" },
  });
  const position = (last?.position ?? 0) + 1;

  await unique(path, "That pack position is taken.", () =>
    db.contentPack.create({
      data: {
        levelId,
        position,
        name: formText(formData, "name") || `Pack ${position}`,
      },
    }),
  );

  done(path);
}

export async function updateContentPack(formData: FormData) {
  await requireAdmin();

  const id = formId(formData, "id");
  const levelId = formId(formData, "levelId");
  const path = `/admin/levels/${levelId}`;

  const name = formText(formData, "name");
  const position = formInt(formData, "position");

  if (!name) fail(path, "A content pack needs a name.");
  if (position === null) fail(path, "Position must be a whole number.");

  await unique(
    path,
    "Another pack in this level already uses that position.",
    () => db.contentPack.update({ where: { id }, data: { name, position } }),
  );

  done(path);
}

export async function deleteContentPack(formData: FormData) {
  await requireAdmin();

  const levelId = formId(formData, "levelId");
  await db.contentPack.delete({ where: { id: formId(formData, "id") } });
  done(`/admin/levels/${levelId}`);
}

/* Words */

export async function createWord(formData: FormData) {
  await requireAdmin();

  const levelId = formId(formData, "levelId");
  const path = `/admin/levels/${levelId}`;

  const hebrew = formText(formData, "hebrew");
  const english = formText(formData, "english");
  if (!hebrew || !english) fail(path, "A word needs both Hebrew and English.");

  const contentPackId = formInt(formData, "contentPackId");

  const last = await db.word.findFirst({
    where: { levelId, contentPackId },
    orderBy: { position: "desc" },
  });

  await db.word.create({
    data: {
      levelId,
      contentPackId,
      hebrew,
      english,
      transliteration: formTextOrNull(formData, "transliteration"),
      note: formTextOrNull(formData, "note"),
      position: (last?.position ?? 0) + 1,
    },
  });

  done(path);
}

export async function updateWord(formData: FormData) {
  await requireAdmin();

  const id = formId(formData, "id");
  const levelId = formId(formData, "levelId");
  const path = `/admin/levels/${levelId}`;

  const hebrew = formText(formData, "hebrew");
  const english = formText(formData, "english");
  const position = formInt(formData, "position");

  if (!hebrew || !english) fail(path, "A word needs both Hebrew and English.");
  if (position === null) fail(path, "Position must be a whole number.");

  await db.word.update({
    where: { id },
    data: {
      hebrew,
      english,
      transliteration: formTextOrNull(formData, "transliteration"),
      note: formTextOrNull(formData, "note"),
      position,
      // The composite FK stops a stale form moving a word to another level's pack.
      contentPackId: formInt(formData, "contentPackId"),
    },
  });

  done(path);
}

export async function deleteWord(formData: FormData) {
  await requireAdmin();

  const levelId = formId(formData, "levelId");
  await db.word.delete({ where: { id: formId(formData, "id") } });
  done(`/admin/levels/${levelId}`);
}
