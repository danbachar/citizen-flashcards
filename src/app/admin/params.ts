import { notFound } from "next/navigation";

/** A route id is a positive integer or the page does not exist. */
export function routeId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) notFound();
  return id;
}

/** The message a failed Server Action redirected back with. */
export function errorMessage(params: {
  error?: string | string[];
}): string | undefined {
  return typeof params.error === "string" ? params.error : undefined;
}
