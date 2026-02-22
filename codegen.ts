import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'backend/src/graphql/schema.ts',
  generates: {
    'backend/src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../graphql/context#Context',
        mappers: {
          User: '@prisma/client#User as UserModel',
          Category: '@prisma/client#Category as CategoryModel',
          Transaction: '@prisma/client#Transaction as TransactionModel',
        },
      },
    },
    'frontend/src/generated/graphql.ts': {
      documents: 'frontend/src/graphql/**/*.ts',
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;
