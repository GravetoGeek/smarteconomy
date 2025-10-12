import {useMutation} from '@apollo/client'
import {CREATE_TRANSACTION} from '../../graphql/mutations/transactions.mutations'

interface CreateTransactionInput {
    description: string
    amount: number
    type: 'INCOME'|'EXPENSE'|'TRANSFER'
    accountId: string
    categoryId?: string
    destinationAccountId?: string
    date?: string
}

interface Transaction {
    id: string
    description: string
    amount: number
    type: string
    status: string
    accountId: string
    categoryId: string
    destinationAccountId?: string
    date: string
    createdAt: string
    updatedAt: string
}

interface CreateTransactionResponse {
    createTransaction: {
        transaction: Transaction
        warnings: string[]
    }
}

/**
 * 💸 useCreateTransaction Hook
 *
 * Custom hook para criar transações usando GraphQL
 *
 * @example
 * ```tsx
 * const AddTransactionScreen = () => {
 *   const { createTransaction, loading, error } = useCreateTransaction();
 *
 *   const handleSubmit = async () => {
 *     const result = await createTransaction({
 *       description: 'Compra supermercado',
 *       amount: 150.50,
 *       type: 'EXPENSE',
 *       accountId: 'acc_123',
 *       categoryId: 'cat_456',
 *       date: new Date().toISOString()
 *     });
 *
 *     if (result) {
 *       console.log('Transaction created:', result.transaction);
 *     }
 *   };
 * };
 * ```
 */
export const useCreateTransaction=() => {
    const [createTransactionMutation,{loading,error}]=useMutation<CreateTransactionResponse>(
        CREATE_TRANSACTION,
        {
            onError: (err) => {
                console.error('[useCreateTransaction] GraphQL error:',err.message)
            }
        }
    )

    const createTransaction=async (input: CreateTransactionInput): Promise<CreateTransactionResponse['createTransaction']|null> => {
        try {
            const {data}=await createTransactionMutation({
                variables: {input}
            })

            if(data?.createTransaction) {
                console.log('[useCreateTransaction] Transaction created:',data.createTransaction.transaction.id)

                if(data.createTransaction.warnings.length>0) {
                    console.warn('[useCreateTransaction] Warnings:',data.createTransaction.warnings)
                }

                return data.createTransaction
            }

            return null
        } catch(err) {
            console.error('[useCreateTransaction] Create failed:',err)
            return null
        }
    }

    return {
        createTransaction,
        loading,
        error
    }
}
