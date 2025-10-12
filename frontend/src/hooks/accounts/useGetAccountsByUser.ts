import {useQuery} from '@apollo/client'
import {GET_ACCOUNTS_BY_USER} from '../../graphql/queries/accounts.queries'

/**
 * Interface para conta retornada da query
 */
interface Account {
    id: string
    name: string
    type: string
    balance: number
    userId: string
    status: string
    createdAt: string
    updatedAt: string
}

/**
 * Interface para resposta da query GetAccountsByUser
 */
interface GetAccountsByUserResponse {
    accountsByUser: Account[]
}

/**
 * Hook personalizado para buscar contas de um usuário
 *
 * @param userId - ID do usuário
 * @returns Objeto contendo accounts, loading e error
 *
 * @example
 * ```tsx
 * const { accounts, loading, error } = useGetAccountsByUser(user?.id)
 *
 * if (loading) return <Text>Carregando...</Text>
 * if (error) return <Text>Erro: {error.message}</Text>
 *
 * return (
 *   <Picker>
 *     {accounts.map(account => (
 *       <Picker.Item key={account.id} label={account.name} value={account.id} />
 *     ))}
 *   </Picker>
 * )
 * ```
 */
export const useGetAccountsByUser=(userId: string|undefined) => {
    const {data,loading,error,refetch}=useQuery<GetAccountsByUserResponse>(
        GET_ACCOUNTS_BY_USER,
        {
            variables: {userId},
            skip: !userId, // Não executa se não tiver userId
            onError: (err) => {
                console.error('[useGetAccountsByUser] GraphQL error:',err.message)
            }
        }
    )

    return {
        accounts: data?.accountsByUser||[],
        loading,
        error,
        refetch
    }
}
