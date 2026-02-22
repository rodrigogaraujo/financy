import { z } from 'zod';
import type { PrismaClient, TransactionType } from '@prisma/client';
import { GraphQLError } from 'graphql';

export const createTransactionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  amount: z.number().int().positive('Valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

export const updateTransactionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  amount: z.number().int().positive('Valor deve ser positivo').optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  date: z.string().optional(),
  categoryId: z.string().optional(),
});

export async function createTransaction(
  prisma: PrismaClient,
  userId: string,
  input: { title: string; amount: number; type: TransactionType; date: string; categoryId: string },
) {
  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    throw new GraphQLError(parsed.error.errors[0].message, { extensions: { code: 'BAD_USER_INPUT' } });
  }

  // Validate category belongs to user
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId },
  });
  if (!category) {
    throw new GraphQLError('Categoria não encontrada', { extensions: { code: 'BAD_USER_INPUT' } });
  }

  return prisma.transaction.create({
    data: {
      title: input.title,
      amount: input.amount,
      type: input.type,
      date: new Date(input.date),
      categoryId: input.categoryId,
      userId,
    },
    include: { category: true },
  });
}

export async function findAllTransactions(
  prisma: PrismaClient,
  userId: string,
  filters?: { search?: string; type?: TransactionType; categoryId?: string },
) {
  const where: { userId: string; title?: { contains: string }; type?: TransactionType; categoryId?: string } = { userId };
  if (filters?.search) {
    where.title = { contains: filters.search };
  }
  if (filters?.type) {
    where.type = filters.type;
  }
  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }
  return prisma.transaction.findMany({
    where,
    include: { category: true },
    orderBy: { date: 'desc' },
  });
}

export async function updateTransaction(
  prisma: PrismaClient,
  userId: string,
  id: string,
  input: { title?: string; amount?: number; type?: TransactionType; date?: string; categoryId?: string },
) {
  const parsed = updateTransactionSchema.safeParse(input);
  if (!parsed.success) {
    throw new GraphQLError(parsed.error.errors[0].message, { extensions: { code: 'BAD_USER_INPUT' } });
  }

  const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!transaction) {
    throw new GraphQLError('Transação não encontrada', { extensions: { code: 'NOT_FOUND' } });
  }

  // If changing category, validate ownership
  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, userId },
    });
    if (!category) {
      throw new GraphQLError('Categoria não encontrada', { extensions: { code: 'BAD_USER_INPUT' } });
    }
  }

  return prisma.transaction.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.amount !== undefined && { amount: input.amount }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.date !== undefined && { date: new Date(input.date) }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
    },
    include: { category: true },
  });
}

export async function deleteTransaction(prisma: PrismaClient, userId: string, id: string) {
  const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!transaction) {
    throw new GraphQLError('Transação não encontrada', { extensions: { code: 'NOT_FOUND' } });
  }

  return prisma.transaction.delete({
    where: { id },
    include: { category: true },
  });
}

export async function getTransactionSummary(prisma: PrismaClient, userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    select: { amount: true, type: true },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === 'INCOME') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }
  }

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
}
