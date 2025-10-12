import {useQuery} from '@apollo/client'
import {GET_CATEGORIES_BY_TYPE} from '../../graphql/queries/categories.queries'

/**
 * Interface para categoria retornada da query
 */
interface Category {
  id: string
  category: string
  createdAt: string
  updatedAt: string
}

/**
 * Interface para resposta da query GetCategoriesByType
 */
interface GetCategoriesByTypeResponse {
  categoriesByType: Category[]
}

/**
 * Hook personalizado para buscar categorias por tipo de transação
 * 
 * @param type - Tipo de transação ('INCOME', 'EXPENSE', 'TRANSFER')
 * @returns Objeto contendo categories, loading e error
 * 
 * @example
 * ```tsx
 * const { categories, loading, error } = useGetCategoriesByType('EXPENSE')
 * 
 * if (loading) return <Text>Carregando...</Text>
 * if (error) return <Text>Erro: {error.message}</Text>
 * 
 * return (
 *   <Picker>
 *     {categories.map(cat => (
 *       <Picker.Item key={cat.id} label={cat.category} value={cat.id} />
 *     ))}
 *   </Picker>
 * )
 * ```
 */
export const useGetCategoriesByType=(type: string)=>{
  const {data,loading,error,refetch}=useQuery<GetCategoriesByTypeResponse>(
    GET_CATEGORIES_BY_TYPE,
    {
      variables: { type },
      skip: !type, // Não executa se não tiver tipo
      onError: (err)=>{
        console.error('[useGetCategoriesByType] GraphQL error:',err.message)
      }
    }
  )

  return {
    categories: data?.categoriesByType || [],
    loading,
    error,
    refetch
  }
}
