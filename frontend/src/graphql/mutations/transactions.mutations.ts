import {gql} from '@apollo/client'

/**
 * 💸 Transactions Mutations
 *
 * Mutations GraphQL para criar e gerenciar transações
 */

/**
 * Mutation para criar nova transação
 */
export const CREATE_TRANSACTION=gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      transaction {
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
      warnings
    }
  }
`

/**
 * Mutation para atualizar transação existente
 */
export const UPDATE_TRANSACTION=gql`
  mutation UpdateTransaction($id: String!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
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
  }
`

/**
 * Mutation para reverter/estornar transação
 */
export const REVERSE_TRANSACTION=gql`
  mutation ReverseTransaction(
    $transactionId: String!
    $reason: String!
    $requestedBy: String!
  ) {
    reverseTransaction(
      transactionId: $transactionId
      reason: $reason
      requestedBy: $requestedBy
    ) {
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
  }
`
