/**
 * 📊 Get Dashboard Metrics Use Case
 *
 * Caso de uso para obter métricas completas do dashboard
 * com agregação de dados financeiros.
 */

import { Injectable } from '@nestjs/common'
import {
    DashboardDomainService,
    FinancialMetrics,
    DashboardFilters
} from '../domain'

export interface GetDashboardMetricsUseCaseInput {
    userId: string
    period?: 'week' | 'month' | 'quarter' | 'year'
    dateFrom?: Date
    dateTo?: Date
    accountIds?: string[]
    categoryIds?: string[]
}

@Injectable()
export class GetDashboardMetricsUseCase {
    constructor(
        private readonly dashboardDomainService: DashboardDomainService
    ) { }

    async execute(input: GetDashboardMetricsUseCaseInput): Promise<FinancialMetrics> {
        // Validar entrada
        this.validateInput(input)

        // Construir filtros
        const filters: DashboardFilters = {
            userId: input.userId,
            period: input.period || 'month',
            dateFrom: input.dateFrom,
            dateTo: input.dateTo,
            accountIds: input.accountIds,
            categoryIds: input.categoryIds
        }

        // Obter métricas através do domain service
        return await this.dashboardDomainService.getFinancialMetrics(filters)
    }

    private validateInput(input: GetDashboardMetricsUseCaseInput): void {
        if (!input.userId) {
            throw new Error('ID do usuário é obrigatório')
        }

        if (input.dateFrom && input.dateTo && input.dateFrom > input.dateTo) {
            throw new Error('Data inicial deve ser anterior à data final')
        }

        if (input.period && !['week', 'month', 'quarter', 'year'].includes(input.period)) {
            throw new Error('Período deve ser: week, month, quarter ou year')
        }
    }
}
