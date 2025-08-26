/**
 * 🔌 Transaction Repository Port
 *
 * Define o contrato para persistência de transações seguindo
 * os princípios da arquitetura hexagonal.
 */

import { Transaction, TransactionType, TransactionStatus } from '../transaction.entity'

export interface TransactionFilters {
    accountId?: string
    categoryId?: string
    type?: TransactionType
    status?: TransactionStatus
    dateFrom?: Date
    dateTo?: Date
    minAmount?: number
    maxAmount?: number
    searchTerm?: string
}

export interface TransactionSearchParams {
    filters?: TransactionFilters
    page?: number
    limit?: number
    sortBy?: 'date' | 'amount' | 'description' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

export interface TransactionSearchResult {
    items: Transaction[]
    total: number
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface TransactionSummary {
    totalIncome: number
    totalExpenses: number
    totalTransfers: number
    netAmount: number
    transactionCount: number
    period: {
        from: Date
        to: Date
    }
}

export interface TransactionRepositoryPort {
    /**
     * Salva uma nova transação
     */
    save(transaction: Transaction): Promise<Transaction>

    /**
     * Atualiza uma transação existente
     */
    update(transaction: Transaction): Promise<Transaction>

    /**
     * Busca transação por ID
     */
    findById(id: string): Promise<Transaction | null>

    /**
     * Busca todas as transações de uma conta
     */
    findByAccountId(accountId: string): Promise<Transaction[]>

    /**
     * Busca transações por categoria
     */
    findByCategoryId(categoryId: string): Promise<Transaction[]>

    /**
     * Busca transações com filtros e paginação
     */
    search(params: TransactionSearchParams): Promise<TransactionSearchResult>

    /**
     * Gera resumo de transações por período
     */
    getSummary(accountId: string, dateFrom: Date, dateTo: Date): Promise<TransactionSummary>

    /**
     * Obtém transações recentes de uma conta
     */
    getRecentTransactions(accountId: string, limit?: number): Promise<Transaction[]>

    /**
     * Obtém transações pendentes de uma conta
     */
    getPendingTransactions(accountId: string): Promise<Transaction[]>

    /**
     * Verifica se existe transação duplicada
     */
    checkDuplicate(
        accountId: string,
        amount: number,
        description: string,
        date: Date
    ): Promise<boolean>

    /**
     * Remove uma transação (soft delete)
     */
    remove(id: string): Promise<void>

    /**
     * Conta total de transações por filtros
     */
    count(filters?: TransactionFilters): Promise<number>

    /**
     * Obtém estatísticas de transações por período
     */
    getStatistics(
        accountId: string,
        period: 'week' | 'month' | 'quarter' | 'year'
    ): Promise<{
        totalTransactions: number
        totalIncome: number
        totalExpenses: number
        averageTransaction: number
        largestTransaction: number
        smallestTransaction: number
    }>
}
