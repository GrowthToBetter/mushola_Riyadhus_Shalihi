import { PrismaClient } from "@prisma/client";
import { env } from "@/env";
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
