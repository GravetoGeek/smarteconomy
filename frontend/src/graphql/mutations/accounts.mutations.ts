import {gql} from '@apollo/client'

/**
 * 💰 Accounts Mutations
 *
 * Mutations GraphQL para criar e gerenciar contas
 */

/**
 * Mutation para criar nova conta
 */
export const CREATE_ACCOUNT=gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
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
`
