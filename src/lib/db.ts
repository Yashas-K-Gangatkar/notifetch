import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma client singleton.
 *
 * On Vercel (serverless), each function invocation gets a new cold start.
 * We cache the PrismaClient on globalThis to prevent connection pool exhaustion
 * during hot-reload in development.
 *
 * If DATABASE_URL is not set or invalid, PrismaClient creation will still succeed
 * but queries will fail at runtime — API routes handle this with try/catch.
 */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // Prevent aggressive connection pooling on serverless
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
