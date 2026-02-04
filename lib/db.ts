import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrisma() {
  // Allow the app to boot in "no DB" mode (marketing pages, preview without DB, etc.)
  // without crashing on import.
  if (!process.env.DATABASE_URL) {
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("DATABASE_URL is not set; Prisma is not configured.");
      },
    });
  }

  return new PrismaClient();
}

export const prisma = global.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
