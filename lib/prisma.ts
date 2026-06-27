import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma: any };

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ adapter, log: ["error"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
