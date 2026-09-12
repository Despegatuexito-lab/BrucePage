import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Cloudflare Workers son de vida corta: se crea un cliente nuevo por
// request en vez de mantener uno global (patrón recomendado por
// @opennextjs/cloudflare para Prisma + D1).
export async function getPrisma(): Promise<PrismaClient> {
  const { env } = await getCloudflareContext({ async: true });
  const adapter = new PrismaD1(env.DB);
  return new PrismaClient({ adapter });
}
