import { GraphQLError } from 'graphql';
import type { TransactionType } from '@prisma/client';
import type { Context } from '../context.js';
import {
  createTransaction,
  findAllTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} from '../../services/transaction.js';

function requireAuth(user: Context['user']): asserts user is NonNullable<Context['user']> {
  if (!user) {
    throw new GraphQLError('Não autenticado', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

export const transactionResolvers = {
  Query: {
    transactions: async (
      _: unknown,
      { filters }: { filters?: { search?: string; type?: TransactionType; categoryId?: string } },
      { prisma, user }: Context,
    ) => {
      requireAuth(user);
      return findAllTransactions(prisma, user.id, filters ?? undefined);
    },

    transactionSummary: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      requireAuth(user);
      return getTransactionSummary(prisma, user.id);
    },
  },

  Mutation: {
    createTransaction: async (
      _: unknown,
      { input }: { input: { title: string; amount: number; type: TransactionType; date: string; categoryId: string } },
      { prisma, user }: Context,
    ) => {
      requireAuth(user);
      return createTransaction(prisma, user.id, input);
    },

    updateTransaction: async (
      _: unknown,
      { id, input }: { id: string; input: { title?: string; amount?: number; type?: TransactionType; date?: string; categoryId?: string } },
      { prisma, user }: Context,
    ) => {
      requireAuth(user);
      return updateTransaction(prisma, user.id, id, input);
    },

    deleteTransaction: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      requireAuth(user);
      return deleteTransaction(prisma, user.id, id);
    },
  },
};
