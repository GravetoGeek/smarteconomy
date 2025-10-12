import { gql } from '@apollo/client';

/**
 * 📂 Categories Queries
 * 
 * Queries GraphQL para buscar categorias de transações
 */

/**
 * Query para buscar todas as categorias
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      category
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query para buscar categoria por ID
 */
export const GET_CATEGORY = gql`
  query GetCategory($id: String!) {
    category(id: $id) {
      id
      category
      createdAt
      updatedAt
    }
  }
`;
