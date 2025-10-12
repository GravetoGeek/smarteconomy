import {gql} from '@apollo/client'

/**
 * 🔐 Auth Mutations
 * 
 * Mutations GraphQL para autenticação e autorização
 */

/**
 * Login mutation
 * Autentica usuário com email e senha
 */
export const LOGIN_MUTATION=gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        role
      }
    }
  }
`

/**
 * Signup mutation
 * Registra novo usuário no sistema
 */
export const SIGNUP_MUTATION=gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      accessToken
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        role
      }
    }
  }
`

/**
 * Logout mutation
 * Invalida token de acesso do usuário
 */
export const LOGOUT_MUTATION=gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      success
      message
    }
  }
`

/**
 * Refresh token mutation
 * Renova token de acesso usando refresh token
 */
export const REFRESH_TOKEN_MUTATION=gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        role
      }
    }
  }
`
