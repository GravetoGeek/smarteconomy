import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {AccountsModule} from '../accounts/accounts.module'
import {AuthModule} from '../auth/auth.module'
import {CategoriesModule} from '../categories/categories.module'
import {DatabaseModule} from '../database/database.module'
import {SharedModule} from '../shared/shared.module'
import {TransactionsModule} from '../transactions/transactions.module'

// Domain Services
import {DashboardDomainService} from './domain/dashboard-domain.service'

// Application Use Cases
import {
    GetDashboardMetricsUseCase,
    GetFinancialTrendsUseCase
} from './application'

// Infrastructure
import {DashboardResolver} from './infrastructure/graphql/dashboard.resolver'

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        AuthModule,         // ✅ Importar AuthModule para ter acesso ao JWT_SERVICE
        TransactionsModule, // ✅ Importar módulo de transações
        AccountsModule,     // ✅ Importar módulo de contas
        CategoriesModule,   // ✅ Importar módulo de categorias
        JwtModule.register({
            secret: process.env.JWT_SECRET||'fallback-secret',
            signOptions: {expiresIn: '1h'}
        })
    ],
    providers: [
        // Domain Services - agora conectado com os repositórios reais
        DashboardDomainService,

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
export class DashboardsModule {}
