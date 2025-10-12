import { gql } from '@apollo/client';

/**
 * 💰 Accounts Queries
 * 
 * Queries GraphQL para buscar contas bancárias
 */

/**
 * Query para buscar todas as contas de um usuário
 */
export const GET_ACCOUNTS_BY_USER = gql`
  query GetAccountsByUser($userId: String!) {
    accountsByUser(userId: $userId) {
      id
      name
      type
      balance
      userId
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query para buscar conta por ID
 */
export const GET_ACCOUNT_BY_ID = gql`
  query GetAccountById($id: String!) {
    accountById(id: $id) {
      id
      name
      type
      balance
      userId
      status
      createdAt
      updatedAt
    }
  }
`;
