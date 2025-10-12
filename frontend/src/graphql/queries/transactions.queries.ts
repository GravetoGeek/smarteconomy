import { gql } from '@apollo/client';

/**
 * 💸 Transactions Queries
 * 
 * Queries GraphQL para buscar transações financeiras
 */

/**
 * Query para buscar transações com filtros e paginação
 */
export const SEARCH_TRANSACTIONS = gql`
  query SearchTransactions($userId: String!, $input: SearchTransactionsInput) {
    searchTransactions(userId: $userId, input: $input) {
      transactions {
        id
        description
        amount
        type
        status
        accountId
        categoryId
        destinationAccountId
        date
        createdAt
        updatedAt
      }
      total
      page
      limit
      totalPages
    }
  }
`;

/**
 * Query para obter resumo de transações em um período
 */
export const TRANSACTION_SUMMARY = gql`
  query TransactionSummary($accountId: String!, $dateFrom: DateTime!, $dateTo: DateTime!) {
    transactionSummary(accountId: $accountId, dateFrom: $dateFrom, dateTo: $dateTo) {
      totalIncome
      totalExpense
      totalTransfer
      balance
      period
    }
  }
`;
