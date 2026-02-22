import type { Request } from 'express';
import type { PrismaClient, User } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { verifyToken } from '../services/auth.js';

export interface Context {
  prisma: PrismaClient;
  user: User | null;
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  const authHeader = req.headers.authorization;
  let user: User | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    if (payload) {
      user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
    }
  }

  return { prisma, user };
}
