import {useQuery} from '@apollo/client'
import {HELLO_QUERY} from '../../graphql/queries/test.queries'

/**
 * Hook de teste para validar conexão GraphQL
 *
 * @example
 * ```tsx
 * const TestComponent = () => {
 *   const { hello, loading, error } = useHelloQuery();
 *
 *   if (loading) return <Text>Carregando...</Text>;
 *   if (error) return <Text>Erro: {error.message}</Text>;
 *
 *   return <Text>Resposta do servidor: {hello}</Text>;
 * };
 * ```
 */
export const useHelloQuery=() => {
    const {data,loading,error}=useQuery(HELLO_QUERY)

    return {
        hello: data?.hello||'',
        loading,
        error,
    }
}
