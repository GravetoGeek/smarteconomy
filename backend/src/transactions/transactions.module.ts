/**
 * 💸 Transactions Module
 *
 * Módulo principal para funcionalidades de transações financeiras
 * seguindo arquitetura hexagonal com DDD.
 */

import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {AccountsModule} from '../accounts/accounts.module'
import {AuthModule} from '../auth/auth.module'
import {DatabaseModule} from '../database/database.module'
import {SharedModule} from '../shared/shared.module'

// Domain Services
import {TransactionDomainService} from './domain/services/transaction-domain.service'

// Application Use Cases
import {
    CreateTransactionUseCase,
    GetTransactionSummaryUseCase,
    ReverseTransactionUseCase,
    SearchTransactionsUseCase,
    UpdateTransactionUseCase
} from './application'

// Infrastructure
import {TransactionsApplicationService} from './application/services/transactions-application.service'
import {PrismaTransactionRepository} from './infrastructure'
import {TransactionResolver} from './infrastructure/graphql/resolvers/transaction.resolver'
import {AccountIntegrationServiceImpl} from './infrastructure/services/account-integration.service'

// Ports
import {TransactionRepositoryPort} from './domain'

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        AuthModule,     // ✅ Importar AuthModule para ter acesso ao JWT_SERVICE
        AccountsModule, // ✅ Importar módulo de contas
        JwtModule.register({
            secret: process.env.JWT_SECRET||'fallback-secret',
            signOptions: {expiresIn: '1h'}
        })
    ],
    providers: [
        // Integration Services
        AccountIntegrationServiceImpl,

        // Repository Implementation
        {
            provide: 'TransactionRepositoryPort',
            useClass: PrismaTransactionRepository
        },

        // Domain Services
        {
            provide: TransactionDomainService,
            useFactory: (transactionRepository: TransactionRepositoryPort) =>
                new TransactionDomainService(transactionRepository),
            inject: ['TransactionRepositoryPort']
        },

        // Use Cases
        {
            provide: CreateTransactionUseCase,
            useFactory: (
                transactionRepository: TransactionRepositoryPort,
                transactionDomainService: TransactionDomainService,
                accountIntegrationService: AccountIntegrationServiceImpl
            ) => new CreateTransactionUseCase(
                transactionRepository,
                transactionDomainService,
                accountIntegrationService // ✅ Injetar serviço de integração
            ),
            inject: ['TransactionRepositoryPort',TransactionDomainService,AccountIntegrationServiceImpl]
        },

        {
            provide: SearchTransactionsUseCase,
            useFactory: (transactionRepository: TransactionRepositoryPort) =>
                new SearchTransactionsUseCase(transactionRepository),
            inject: ['TransactionRepositoryPort']
        },

        {
            provide: GetTransactionSummaryUseCase,
            useFactory: (transactionRepository: TransactionRepositoryPort) =>
                new GetTransactionSummaryUseCase(transactionRepository),
            inject: ['TransactionRepositoryPort']
        },

        {
            provide: UpdateTransactionUseCase,
            useFactory: (transactionRepository: TransactionRepositoryPort) =>
                new UpdateTransactionUseCase(transactionRepository),
            inject: ['TransactionRepositoryPort']
        },

        {
            provide: ReverseTransactionUseCase,
            useFactory: (
                transactionRepository: TransactionRepositoryPort,
                transactionDomainService: TransactionDomainService
            ) => new ReverseTransactionUseCase(
                transactionRepository,
                transactionDomainService,
                null // auditService - será injetado quando disponível
            ),
            inject: ['TransactionRepositoryPort',TransactionDomainService]
        },

        // Application Service
        TransactionsApplicationService,

        // GraphQL Resolver
        TransactionResolver
    ],
    exports: [
        'TransactionRepositoryPort',
        TransactionDomainService,
        CreateTransactionUseCase,
        SearchTransactionsUseCase,
        GetTransactionSummaryUseCase,
        UpdateTransactionUseCase,
        ReverseTransactionUseCase,
        TransactionsApplicationService
    ]
})
export class TransactionsModule {}
