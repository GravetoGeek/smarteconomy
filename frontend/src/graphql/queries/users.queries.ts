import {gql} from '@apollo/client'

/**
 * 👤 Users Queries
 *
 * Queries GraphQL para buscar dados de usuários
 */

/**
 * Query para buscar todos os usuários
 */
export const GET_USERS=gql`
  query GetUsers {
    users {
      id
      email
      name
      lastname
      birthdate
      role
      genderId
      professionId
      profileId
      status
      createdAt
      updatedAt
    }
  }
`

/**
 * Query para buscar usuário por ID
 */
export const GET_USER_BY_ID=gql`
  query GetUserById($id: String!) {
    userById(id: $id) {
      id
      email
      name
      lastname
      birthdate
      role
      genderId
      professionId
      profileId
      status
      createdAt
      updatedAt
    }
  }
`

/**
 * Query para buscar usuário por email
 */
export const GET_USER_BY_EMAIL=gql`
  query GetUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      email
      name
      lastname
      birthdate
      role
      genderId
      professionId
      profileId
      status
      createdAt
      updatedAt
    }
  }
`

/**
 * Query para buscar usuários com paginação e filtros
 */
export const SEARCH_USERS=gql`
  query SearchUsers($input: SearchUsersInput!) {
    searchUsers(input: $input) {
      items {
        id
        email
        name
        lastname
        birthdate
        role
        genderId
        professionId
        profileId
        status
        createdAt
        updatedAt
      }
      total
      currentPage
      limit
      totalPages
      lastPage
    }
  }
`
