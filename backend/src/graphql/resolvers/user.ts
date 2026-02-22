import { GraphQLError } from 'graphql';
import type { Context } from '../context.js';
import { hashPassword, verifyPassword, signToken, registerSchema, loginSchema } from '../../services/auth.js';

function requireAuth(user: Context['user']): asserts user is NonNullable<Context['user']> {
  if (!user) {
    throw new GraphQLError('Não autenticado', { extensions: { code: 'UNAUTHENTICATED' } });
  }
}

export const userResolvers = {
  Query: {
    me: (_: unknown, __: unknown, { user }: Context) => {
      return user;
    },
  },

  Mutation: {
    updateProfile: async (
      _: unknown,
      { input }: { input: { name: string } },
      { prisma, user }: Context,
    ) => {
      requireAuth(user);
      const trimmedName = input.name.trim();
      if (trimmedName.length < 2) {
        throw new GraphQLError('Nome deve ter pelo menos 2 caracteres', { extensions: { code: 'BAD_USER_INPUT' } });
      }
      return prisma.user.update({
        where: { id: user.id },
        data: { name: trimmedName },
      });
    },

    register: async (_: unknown, { input }: { input: { name: string; email: string; password: string } }, { prisma }: Context) => {
      const parsed = registerSchema.safeParse(input);
      if (!parsed.success) {
        throw new GraphQLError(parsed.error.errors[0].message, { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) {
        throw new GraphQLError('Email já cadastrado', { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
      });

      const token = signToken(user.id);
      return { token, user };
    },

    login: async (_: unknown, { input }: { input: { email: string; password: string } }, { prisma }: Context) => {
      const parsed = loginSchema.safeParse(input);
      if (!parsed.success) {
        throw new GraphQLError(parsed.error.errors[0].message, { extensions: { code: 'BAD_USER_INPUT' } });
      }

      const user = await prisma.user.findUnique({ where: { email: input.email } });
      if (!user) {
        throw new GraphQLError('Credenciais inválidas', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const valid = await verifyPassword(input.password, user.password);
      if (!valid) {
        throw new GraphQLError('Credenciais inválidas', { extensions: { code: 'UNAUTHENTICATED' } });
      }

      const token = signToken(user.id);
      return { token, user };
    },
  },
};
