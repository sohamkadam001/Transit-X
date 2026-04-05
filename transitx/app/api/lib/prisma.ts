import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"

dotenv.config()

// 1. Create a Postgres connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// 2. Wrap the pool in Prisma's Postgres adapter
const adapter = new PrismaPg(pool)


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(({ adapter }))

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}