/**
 * 📈 Get Financial Trends Use Case
 *
 * Caso de uso para obter tendências financeiras
 * ao longo do tempo para gráficos.
 */

import { Injectable } from '@nestjs/common'
import { DashboardDomainService } from '../domain'

export interface GetFinancialTrendsUseCaseInput {
    userId: string
    months?: number // Quantos meses incluir na análise (padrão: 6)
}

export interface FinancialTrendData {
    month: string
    income: number
    expenses: number
    net: number
}

@Injectable()
export class GetFinancialTrendsUseCase {
    constructor(
        private readonly dashboardDomainService: DashboardDomainService
    ) { }

    async execute(input: GetFinancialTrendsUseCaseInput): Promise<FinancialTrendData[]> {
        // Validar entrada
        this.validateInput(input)

        const months = input.months || 6

        // Obter tendências através do domain service
        return await this.dashboardDomainService.getFinancialTrends(
            input.userId,
            months
        )
    }

    private validateInput(input: GetFinancialTrendsUseCaseInput): void {
        if (!input.userId) {
            throw new Error('ID do usuário é obrigatório')
        }

        if (input.months && (input.months < 1 || input.months > 24)) {
            throw new Error('Número de meses deve estar entre 1 e 24')
        }
    }
}
