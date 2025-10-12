import {useMutation} from '@apollo/client'
import {useState} from 'react'
import {CREATE_ACCOUNT} from '../../graphql/mutations/accounts.mutations'

interface CreateAccountInput {
    name: string
    type: string
    balance?: number
    userId: string
}

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

interface CreateAccountResponse {
    createAccount: Account
}

/**
 * 💰 useCreateAccount Hook
 *
 * Custom hook para criar nova conta usando GraphQL
 *
 * @example
 * ```tsx
 * const AddAccountScreen = () => {
 *   const { createAccount, loading, error } = useCreateAccount();
 *   const { user } = useContext(Store);
 *
 *   const handleSubmit = async () => {
 *     const result = await createAccount({
 *       name: 'Conta Corrente',
 *       type: 'checking',
 *       balance: 1000,
 *       userId: user.id
 *     });
 *
 *     if (result) {
 *       navigation.navigate('Dashboard');
 *     }
 *   };
 * };
 * ```
 */
export const useCreateAccount=() => {
    const [account,setAccount]=useState<Account|null>(null)

    const [createAccountMutation,{loading,error}]=useMutation<CreateAccountResponse>(
        CREATE_ACCOUNT,
        {
            onError: (err) => {
                console.error('[useCreateAccount] GraphQL error:',err.message)
            },
        }
    )

    const createAccount=async (input: CreateAccountInput): Promise<Account|null> => {
        try {
            const {data}=await createAccountMutation({
                variables: {input},
            })

            if(data?.createAccount) {
                setAccount(data.createAccount)
                console.log('[useCreateAccount] Account created:',data.createAccount.id)
                return data.createAccount
            }

            return null
        } catch(err) {
            console.error('[useCreateAccount] Create account failed:',err)
            return null
        }
    }

    return {
        createAccount,
        loading,
        error,
        account,
    }
}
