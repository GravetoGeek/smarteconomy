import {gql} from '@apollo/client'

/**
 * 🔐 Auth Queries
 *
 * Queries GraphQL para validação de autenticação
 */

/**
 * Validate token query
 * Verifica se o token JWT é válido
 */
export const VALIDATE_TOKEN_QUERY=gql`
  query ValidateToken($input: ValidateTokenInput!) {
    validateToken(input: $input) {
      valid
      user {
        id
        email
        role
      }
    }
  }
`

/**
 * Get current user query
 * Obtém dados do usuário autenticado
 * (requer token no header via authLink)
 */
export const ME_QUERY=gql`
  query Me {
    me {
      id
      email
      name
      lastname
      role
      status
      createdAt
    }
  }
`
