import { gql } from '@apollo/client';

/**
 * 👤 Users Mutations
 * 
 * Mutations GraphQL para gerenciar usuários
 */

/**
 * Mutation para criar novo usuário
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
`;

/**
 * Mutation para atualizar usuário existente
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      success
      message
      user {
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
  }
`;

/**
 * Mutation para deletar usuário
 */
export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;
