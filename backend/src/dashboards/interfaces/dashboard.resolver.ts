/**
 * 📊 Dashboard GraphQL Resolver
 *
 * Resolver para operações de dashboard e métricas financeiras
 * via GraphQL.
 */

import { Resolver, Query, Args } from '@nestjs/graphql'
import { Injectable, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../../auth/infrastructure/guards/jwt.guard'
import {
    GetDashboardMetricsUseCase,
    GetFinancialTrendsUseCase
} from '../application'
import type {
    GetDashboardMetricsUseCaseInput,
    GetFinancialTrendsUseCaseInput
} from '../application'

@Resolver('Dashboard')
@Injectable()
export class DashboardResolver {
    constructor(
        private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase,
        private readonly getFinancialTrendsUseCase: GetFinancialTrendsUseCase
    ) { }

    @Query(() => String) // Simplified return type
    @UseGuards(JwtGuard)
    async dashboardMetrics(
        @Args('userId', { type: () => String }) userId: string,
        @Args('period', { type: () => String, nullable: true }) period?: 'week' | 'month' | 'quarter' | 'year',
        @Args('dateFrom', { type: () => String, nullable: true }) dateFrom?: string,
        @Args('dateTo', { type: () => String, nullable: true }) dateTo?: string,
        @Args('accountIds', { type: () => [String], nullable: true }) accountIds?: string[],
        @Args('categoryIds', { type: () => [String], nullable: true }) categoryIds?: string[]
    ): Promise<any> {
        const input: GetDashboardMetricsUseCaseInput = {
            userId,
            period,
            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
            dateTo: dateTo ? new Date(dateTo) : undefined,
            accountIds,
            categoryIds
        }

        return await this.getDashboardMetricsUseCase.execute(input)
    }

    @Query(() => String) // Simplified return type
    @UseGuards(JwtGuard)
    async financialTrends(
        @Args('userId', { type: () => String }) userId: string,
        @Args('months', { type: () => Number, nullable: true }) months?: number
    ): Promise<any> {
        const input: GetFinancialTrendsUseCaseInput = {
            userId,
            months
        }

        return await this.getFinancialTrendsUseCase.execute(input)
    }

    @Query(() => String)
    @UseGuards(JwtGuard)
    async accountsSummary(
        @Args('userId', { type: () => String }) userId: string
    ): Promise<any> {
        // Esta funcionalidade seria implementada através de um use case dedicado
        // ou delegada para o domain service diretamente
        throw new Error('Not implemented yet')
    }

    @Query(() => String)
    @UseGuards(JwtGuard)
    async financialAlerts(
        @Args('userId', { type: () => String }) userId: string
    ): Promise<any> {
        // Esta funcionalidade seria implementada através de um use case dedicado
        // ou delegada para o domain service diretamente
        throw new Error('Not implemented yet')
    }

    @Query(() => String)
    @UseGuards(JwtGuard)
    async categoryAnalysis(
        @Args('userId', { type: () => String }) userId: string,
        @Args('period', { type: () => String, nullable: true }) period?: 'week' | 'month' | 'quarter' | 'year'
    ): Promise<any> {
        const metrics = await this.getDashboardMetricsUseCase.execute({
            userId,
            period: period || 'month'
        })

        return metrics.expensesByCategory
    }

    @Query(() => String)
    @UseGuards(JwtGuard)
    async periodComparison(
        @Args('userId', { type: () => String }) userId: string,
        @Args('period', { type: () => String }) period: 'week' | 'month' | 'quarter' | 'year'
    ): Promise<any> {
        // Esta funcionalidade seria implementada através de um use case dedicado
        // para comparação de períodos
        throw new Error('Not implemented yet')
    }
}
