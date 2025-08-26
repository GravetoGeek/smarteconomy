/**
 * 📊 Dashboards Module
 *
 * Módulo para funcionalidades de dashboard e métricas financeiras
 * seguindo arquitetura hexagonal com DDD.
 */

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from '../database/database.module'
import { SharedModule } from '../shared/shared.module'

// Domain Services
import { DashboardDomainService } from './domain/dashboard-domain.service'

// Application Use Cases
import {
    GetDashboardMetricsUseCase,
    GetFinancialTrendsUseCase
} from './application'

// Interfaces
import { DashboardResolver } from './interfaces/dashboard.resolver'

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'fallback-secret',
            signOptions: { expiresIn: '1h' }
        })
    ],
    providers: [
        // Domain Services
        {
            provide: DashboardDomainService,
            useFactory: () => new DashboardDomainService(
                null, // transactionRepository - será injetado quando disponível
                null, // accountRepository - será injetado quando disponível
                null  // categoryRepository - será injetado quando disponível
            )
        },

        // Use Cases
        {
            provide: GetDashboardMetricsUseCase,
            useFactory: (dashboardDomainService: DashboardDomainService) =>
                new GetDashboardMetricsUseCase(dashboardDomainService),
            inject: [DashboardDomainService]
        },

        {
            provide: GetFinancialTrendsUseCase,
            useFactory: (dashboardDomainService: DashboardDomainService) =>
                new GetFinancialTrendsUseCase(dashboardDomainService),
            inject: [DashboardDomainService]
        },

        // GraphQL Resolver
        DashboardResolver
    ],
    exports: [
        DashboardDomainService,
        GetDashboardMetricsUseCase,
        GetFinancialTrendsUseCase
    ]
})
export class DashboardsModule { }
