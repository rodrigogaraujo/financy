import { userResolvers } from './user.js';
import { categoryResolvers } from './category.js';
import { transactionResolvers } from './transaction.js';

const toISO = (v: unknown) => (v instanceof Date ? v.toISOString() : v);

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...categoryResolvers.Query,
    ...transactionResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...categoryResolvers.Mutation,
    ...transactionResolvers.Mutation,
  },
  User: {
    createdAt: (parent: { createdAt: unknown }) => toISO(parent.createdAt),
    updatedAt: (parent: { updatedAt: unknown }) => toISO(parent.updatedAt),
  },
  Category: {
    createdAt: (parent: { createdAt: unknown }) => toISO(parent.createdAt),
    updatedAt: (parent: { updatedAt: unknown }) => toISO(parent.updatedAt),
  },
  Transaction: {
    date: (parent: { date: unknown }) => toISO(parent.date),
    createdAt: (parent: { createdAt: unknown }) => toISO(parent.createdAt),
    updatedAt: (parent: { updatedAt: unknown }) => toISO(parent.updatedAt),
  },
};
