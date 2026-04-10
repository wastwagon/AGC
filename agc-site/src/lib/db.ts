import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/** Quieter `next build` when DB is optional or behind schema (see Dockerfile `BUILD_WITHOUT_DB`, or `DEV_WITHOUT_DB` in `.env.local`). */
function prismaLogLevels(): ("warn" | "error")[] {
  if (process.env.NODE_ENV === "development") return ["error", "warn"];
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  return ["error"];
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogLevels(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
