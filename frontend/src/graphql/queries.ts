import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      color
      icon
      type
      createdAt
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($filters: TransactionFilterInput) {
    transactions(filters: $filters) {
      id
      title
      amount
      type
      date
      categoryId
      category {
        id
        name
        color
      }
      createdAt
    }
  }
`;

export const GET_TRANSACTION_SUMMARY = gql`
  query GetTransactionSummary {
    transactionSummary {
      totalIncome
      totalExpense
      balance
    }
  }
`;
