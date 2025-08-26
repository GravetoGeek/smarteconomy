/**
 * 💸 Transactions Module
 *
 * Módulo principal para funcionalidades de transações financeiras
 * seguindo arquitetura hexagonal com DDD.
 */

import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from '../database/database.module'
import { SharedModule } from '../shared/shared.module'

// Domain Services
import { TransactionDomainService } from './domain/services/transaction-domain.service'

// Application Use Cases
import {
    CreateTransactionUseCase,
    SearchTransactionsUseCase,
    GetTransactionSummaryUseCase,
    UpdateTransactionUseCase,
    ReverseTransactionUseCase
} from './application'

// Infrastructure
import { PrismaTransactionRepository } from './infrastructure'

// Interfaces
import { TransactionResolver } from './interfaces/graphql/transaction.resolver'

// Ports
import { TransactionRepositoryPort } from './domain'

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
        TransactionDomainService,

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
                transactionDomainService: TransactionDomainService
            ) => new CreateTransactionUseCase(
                transactionRepository,
                transactionDomainService,
                null // accountService - será injetado quando disponível
            ),
            inject: ['TransactionRepositoryPort', TransactionDomainService]
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
            inject: ['TransactionRepositoryPort', TransactionDomainService]
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
export class TransactionsModule { }
