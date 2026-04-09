import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// 1. Ensure we don't crash if the env variable is missing at build time
const connectionString = process.env.DATABASE_URL;

// 2. Attach Prisma to the global namespace so Next.js HMR doesn't spin up infinite connections
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 3. Initialize the connection pool and adapter (Prisma 7 requirement)
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 4. Export the singleton instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });
