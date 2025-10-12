import { useMutation } from '@apollo/client';
import { UPDATE_TRANSACTION } from '../../graphql/mutations/transactions.mutations';

interface UpdateTransactionInput {
  id: string;
  description?: string;
  amount?: number;
  date?: string;
  transactionTypeId?: number;
  accountId?: string;
  categoryId?: string;
  destinationAccountId?: string;
}

interface UpdateTransactionVariables {
  updateTransactionInput: UpdateTransactionInput;
}

interface UpdateTransactionResponse {
  updateTransaction: {
    id: string;
    description: string;
    amount: number;
    date: string;
  };
}

export const useUpdateTransaction = () => {
  const [updateTransactionMutation, { data, loading, error }] = useMutation<
    UpdateTransactionResponse,
    UpdateTransactionVariables
  >(UPDATE_TRANSACTION);

  const updateTransaction = async (input: UpdateTransactionInput) => {
    try {
      const result = await updateTransactionMutation({
        variables: {
          updateTransactionInput: input,
        },
      });
      return result.data?.updateTransaction;
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  return {
    updateTransaction,
    data: data?.updateTransaction,
    loading,
    error,
  };
};
