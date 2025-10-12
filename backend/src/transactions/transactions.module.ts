/**
 * 💸 Transactions Module
 *
 * Módulo principal para funcionalidades de transações financeiras
 * seguindo arquitetura hexagonal com DDD.
 */

import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {AccountsModule} from '../accounts/accounts.module'
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
import {PrismaTransactionRepository} from './infrastructure'
import {AccountIntegrationServiceImpl} from './infrastructure/services/account-integration.service'

// Interfaces
import {TransactionResolver} from './interfaces/graphql/transaction.resolver'

// Ports
import {TransactionRepositoryPort} from './domain'

@Module({
    imports: [
        DatabaseModule,
        SharedModule,
        AccountsModule, // ✅ Importar módulo de contas
        JwtModule.register({
            secret: process.env.JWT_SECRET||'fallback-secret',
            signOptions: {expiresIn: '1h'}
        })
    ],
    providers: [
        // Domain Services
        TransactionDomainService,

        // Integration Services
        AccountIntegrationServiceImpl,

        // Repository Implementation
        {
            provide: 'TransactionRepositoryPort',
            useClass: PrismaTransactionRepository
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
        ReverseTransactionUseCase
    ]
})
export class TransactionsModule {}
