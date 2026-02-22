import { GraphQLError } from 'graphql';
import type { TransactionType } from '@prisma/client';
import type { Context } from '../context.js';
import { createCategory, findAllCategories, updateCategory, deleteCategory } from '../../services/category.js';

function requireAuth(user: Context['user']): asserts user is NonNullable<Context['user']> {
  if (!user) {
    throw new GraphQLError('Não autenticado', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

export const categoryResolvers = {
  Query: {
    categories: async (_: unknown, __: unknown, { prisma, user }: Context) => {
      requireAuth(user);
      return findAllCategories(prisma, user.id);
    },
  },

  Mutation: {
    createCategory: async (
      _: unknown,
      { input }: { input: { name: string; type: TransactionType; color?: string | null } },
      { prisma, user }: Context,
    ) => {
      requireAuth(user);
      return createCategory(prisma, user.id, input);
    },

    updateCategory: async (
      _: unknown,
      { id, input }: { id: string; input: { name?: string; type?: TransactionType; color?: string | null } },
      { prisma, user }: Context,
    ) => {
      requireAuth(user);
      return updateCategory(prisma, user.id, id, input);
    },

    deleteCategory: async (_: unknown, { id }: { id: string }, { prisma, user }: Context) => {
      requireAuth(user);
      return deleteCategory(prisma, user.id, id);
    },
  },
};
