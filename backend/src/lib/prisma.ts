import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enable WAL mode for better concurrent read performance
prisma.$executeRawUnsafe('PRAGMA journal_mode=WAL').catch(() => {
  // Silently ignore if WAL mode is already enabled or not supported
});

export { prisma };
