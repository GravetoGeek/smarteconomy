import { useQuery } from '@apollo/client';
import { SEARCH_TRANSACTIONS } from '../../graphql/queries/transactions.queries';

interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

interface SearchTransactionsInput {
  filters?: TransactionFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  accountId: string;
  categoryId: string;
  destinationAccountId?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionSearchResult {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 💸 useSearchTransactions Hook
 *
 * Custom hook para buscar transações com filtros usando GraphQL
 *
 * @example
 * ```tsx
 * const ListTransactionsScreen = () => {
 *   const { transactions, loading, error, refetch } = useSearchTransactions({
 *     userId: user.id,
 *     input: {
 *       filters: {
 *         dateFrom: '2025-01-01',
 *         dateTo: '2025-12-31'
 *       },
 *       page: 1,
 *       limit: 50
 *     }
 *   });
 * };
 * ```
 */
export const useSearchTransactions = (userId: string, input?: SearchTransactionsInput) => {
  const { data, loading, error, refetch } = useQuery<{ searchTransactions: TransactionSearchResult }>(
    SEARCH_TRANSACTIONS,
    {
      variables: { userId, input },
      skip: !userId,
      onError: (err) => {
        console.error('[useSearchTransactions] GraphQL error:', err.message);
      },
    }
  );

  return {
    transactions: data?.searchTransactions?.transactions || [],
    total: data?.searchTransactions?.total || 0,
    page: data?.searchTransactions?.page || 1,
    limit: data?.searchTransactions?.limit || 50,
    totalPages: data?.searchTransactions?.totalPages || 0,
    loading,
    error,
    refetch,
  };
};
