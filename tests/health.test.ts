import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { expect, it } from "vitest";

const run = promisify(execFile);

/**
 * The health endpoint's whole job is to describe a broken system, so the cases
 * that matter are the ones where nothing works. Each runs in a child process
 * with its own environment and asserts the endpoint answers rather than throws.
 *
 * The script is wrapped in an IIFE and reads the namespace off "default"
 * because "tsx -e" compiles to CommonJS.
 */
const SCRIPT = [
  "(async () => {",
  '  const loaded = await import("@/app/health/route");',
  "  const { GET } = loaded.default ?? loaded;",
  "  const response = await GET();",
  '  console.log("HEALTH:" + JSON.stringify({',
  "    status: response.status,",
  "    body: await response.json(),",
  "  }));",
  "})();",
].join("\n");

async function health(env: NodeJS.ProcessEnv) {
  const { stdout } = await run("npx", ["tsx", "-e", SCRIPT], { env });
  // Prisma writes its own connection errors to stdout, so the payload is
  // tagged rather than assumed to be the last line.
  const line = stdout.split("\n").find((row) => row.startsWith("HEALTH:"));
  if (!line) throw new Error(`no health payload in output:\n${stdout}`);
  return JSON.parse(line.slice("HEALTH:".length));
}

it(
  "reports a degraded database when Postgres is unreachable",
  async () => {
    // Port 1 refuses immediately — a database that is configured but down,
    // which is what "reachable" actually means.
    const result = await health({
      ...process.env,
      DATABASE_URL: "postgresql://citizen:citizen@127.0.0.1:1/citizen",
    });

    expect(result.status).toBe(503);
    expect(result.body.status).toBe("degraded");
    expect(result.body.database.reachable).toBe(false);
    expect(result.body.database.error).toBeTruthy();
  },
  60_000,
);

it(
  "reports a degraded database instead of throwing when the URL is missing in production",
  async () => {
    // Development falls back to the local Docker URL, so only a deployed
    // environment can be misconfigured this way. Constructing the Prisma
    // client throws here, which is why the route imports it lazily.
    const env: NodeJS.ProcessEnv = { ...process.env, VERCEL_ENV: "production" };
    delete env.DATABASE_URL;

    const result = await health(env);

    expect(result.status).toBe(503);
    expect(result.body.status).toBe("degraded");
    expect(result.body.database.reachable).toBe(false);
    expect(result.body.database.error).toContain("DATABASE_URL");
  },
  60_000,
);
