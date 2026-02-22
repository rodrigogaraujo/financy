import { z } from 'zod';
import type { PrismaClient, TransactionType } from '@prisma/client';
import { GraphQLError } from 'graphql';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['INCOME', 'EXPENSE']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser hexadecimal válida (#RRGGBB)').nullable().optional(),
  icon: z.string().nullable().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser hexadecimal válida (#RRGGBB)').nullable().optional(),
  icon: z.string().nullable().optional(),
});

export async function createCategory(
  prisma: PrismaClient,
  userId: string,
  input: { name: string; type: TransactionType; color?: string | null; icon?: string | null },
) {
  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) {
    throw new GraphQLError(parsed.error.errors[0].message, { extensions: { code: 'BAD_USER_INPUT' } });
  }

  return prisma.category.create({
    data: {
      name: input.name,
      type: input.type,
      color: input.color ?? null,
      icon: input.icon ?? null,
      userId,
    },
  });
}

export async function findAllCategories(prisma: PrismaClient, userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateCategory(
  prisma: PrismaClient,
  userId: string,
  id: string,
  input: { name?: string; type?: TransactionType; color?: string | null; icon?: string | null },
) {
  const parsed = updateCategorySchema.safeParse(input);
  if (!parsed.success) {
    throw new GraphQLError(parsed.error.errors[0].message, { extensions: { code: 'BAD_USER_INPUT' } });
  }

  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) {
    throw new GraphQLError('Categoria não encontrada', { extensions: { code: 'NOT_FOUND' } });
  }

  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.icon !== undefined && { icon: input.icon }),
    },
  });
}

export async function deleteCategory(prisma: PrismaClient, userId: string, id: string) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) {
    throw new GraphQLError('Categoria não encontrada', { extensions: { code: 'NOT_FOUND' } });
  }

  const transactionCount = await prisma.transaction.count({ where: { categoryId: id } });
  if (transactionCount > 0) {
    throw new GraphQLError(
      `Não é possível deletar: categoria possui ${transactionCount} transação(ões) associada(s). Remova as transações primeiro.`,
      { extensions: { code: 'BAD_USER_INPUT' } },
    );
  }

  return prisma.category.delete({ where: { id } });
}
