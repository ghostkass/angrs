import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient, pgPool?: Pool };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL est requise.");
  }
  
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({ 
      connectionString,
      idleTimeoutMillis: 60000,
      keepAlive: true,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1") 
        ? false 
        : { rejectUnauthorized: false }
    });
  }
  
  const adapter = new PrismaPg(globalForPrisma.pgPool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
