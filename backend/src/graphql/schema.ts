export const typeDefs = `#graphql
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    color: String
    icon: String
    type: TransactionType!
    userId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: ID!
    title: String!
    amount: Int!
    type: TransactionType!
    date: String!
    categoryId: ID!
    category: Category
    userId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type TransactionSummary {
    totalIncome: Int!
    totalExpense: Int!
    balance: Int!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateCategoryInput {
    name: String!
    type: TransactionType!
    color: String
    icon: String
  }

  input UpdateCategoryInput {
    name: String
    type: TransactionType
    color: String
    icon: String
  }

  input UpdateProfileInput {
    name: String!
  }

  input CreateTransactionInput {
    title: String!
    amount: Int!
    type: TransactionType!
    date: String!
    categoryId: ID!
  }

  input UpdateTransactionInput {
    title: String
    amount: Int
    type: TransactionType
    date: String
    categoryId: ID
  }

  input TransactionFilterInput {
    search: String
    type: TransactionType
    categoryId: ID
  }

  type Query {
    """Current authenticated user"""
    me: User

    """List all categories for the authenticated user"""
    categories: [Category!]!

    """List all transactions for the authenticated user"""
    transactions(filters: TransactionFilterInput): [Transaction!]!

    """Dashboard summary (totals) for the authenticated user"""
    transactionSummary: TransactionSummary!
  }

  type Mutation {
    """Register a new user account"""
    register(input: RegisterInput!): AuthPayload!

    """Login with email and password"""
    login(input: LoginInput!): AuthPayload!

    """Update the authenticated user's profile"""
    updateProfile(input: UpdateProfileInput!): User!

    """Create a new category"""
    createCategory(input: CreateCategoryInput!): Category!

    """Update an existing category"""
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!

    """Delete a category (fails if it has transactions)"""
    deleteCategory(id: ID!): Category!

    """Create a new transaction"""
    createTransaction(input: CreateTransactionInput!): Transaction!

    """Update an existing transaction"""
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!

    """Delete a transaction"""
    deleteTransaction(id: ID!): Transaction!
  }
`;
