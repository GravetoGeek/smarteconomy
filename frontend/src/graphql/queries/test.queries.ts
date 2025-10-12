import {gql} from '@apollo/client'

/**
 * Query simples para testar conexão GraphQL
 */
export const HELLO_QUERY=gql`
  query Hello {
    hello
  }
`
