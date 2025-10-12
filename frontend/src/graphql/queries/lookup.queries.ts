import {gql} from '@apollo/client'

/**
 * Query para buscar todos os gêneros disponíveis
 */
export const GET_GENDERS=gql`
  query GetGenders {
    genders {
      id
      gender
    }
  }
`

/**
 * Query para buscar todas as profissões disponíveis
 */
export const GET_PROFESSIONS=gql`
  query GetProfessions {
    professions {
      id
      profession
    }
  }
`
