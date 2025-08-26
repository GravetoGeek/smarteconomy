/**
 * 🔍 Search Transactions Use Case
 *
 * Caso de uso para busca e filtragem de transações
 * com paginação e ordenação.
 */

import { Injectable } from '@nestjs/common'
import {
    TransactionRepositoryPort,
    TransactionSearchParams,
    TransactionSearchResult
} from '../../domain'

export interface SearchTransactionsUseCaseInput {
    filters?: {
        accountId?: string
        categoryId?: string
        type?: string
        status?: string
        dateFrom?: string
        dateTo?: string
        minAmount?: number
        maxAmount?: number
        searchTerm?: string
    }
    page?: number
    limit?: number
    sortBy?: 'date' | 'amount' | 'description' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

@Injectable()
export class SearchTransactionsUseCase {
    constructor(
        private readonly transactionRepository: TransactionRepositoryPort
    ) { }

    async execute(input: SearchTransactionsUseCaseInput): Promise<TransactionSearchResult> {
        // Construir parâmetros de busca
        const searchParams: TransactionSearchParams = {
            filters: input.filters ? {
                accountId: input.filters.accountId,
                categoryId: input.filters.categoryId,
                type: input.filters.type as any,
                status: input.filters.status as any,
                dateFrom: input.filters.dateFrom ? new Date(input.filters.dateFrom) : undefined,
                dateTo: input.filters.dateTo ? new Date(input.filters.dateTo) : undefined,
                minAmount: input.filters.minAmount,
                maxAmount: input.filters.maxAmount,
                searchTerm: input.filters.searchTerm
            } : undefined,
            page: input.page || 1,
            limit: Math.min(input.limit || 20, 100), // Limitar a 100 itens por página
            sortBy: input.sortBy || 'date',
            sortOrder: input.sortOrder || 'desc'
        }

        // Validar parâmetros
        this.validateSearchParams(searchParams)

        // Executar busca
        return await this.transactionRepository.search(searchParams)
    }

    private validateSearchParams(params: TransactionSearchParams): void {
        if (params.page && params.page < 1) {
            throw new Error('Página deve ser maior que 0')
        }

        if (params.limit && (params.limit < 1 || params.limit > 100)) {
            throw new Error('Limite deve estar entre 1 e 100')
        }

        if (params.filters?.dateFrom && params.filters?.dateTo) {
            if (params.filters.dateFrom > params.filters.dateTo) {
                throw new Error('Data inicial deve ser anterior à data final')
            }
        }

        if (params.filters?.minAmount && params.filters?.maxAmount) {
            if (params.filters.minAmount > params.filters.maxAmount) {
                throw new Error('Valor mínimo deve ser menor que o valor máximo')
            }
        }
    }
}
