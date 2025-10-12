/**
 * 📡 Transaction GraphQL Resolver
 *
 * Resolver principal para operações de transações via GraphQL
 * seguindo os padrões estabelecidos no projeto.
 */

import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Injectable, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../../../auth/infrastructure/guards/jwt.guard'
import {
    CreateTransactionUseCase,
    SearchTransactionsUseCase,
    GetTransactionSummaryUseCase,
    UpdateTransactionUseCase,
    ReverseTransactionUseCase
} from '../../application'

// Simplified DTOs for now (since we have GraphQL issues)
interface TransactionDto {
    id: string
    description: string
    amount: number
    type: string
    status: string
    accountId: string
    categoryId: string
    destinationAccountId?: string
    date: Date
    createdAt: Date
    updatedAt: Date
    isExpense: boolean
    isIncome: boolean
    isTransfer: boolean
    isPending: boolean
    isCompleted: boolean
    canBeCompleted: boolean
    canBeCancelled: boolean
    canBeReversed: boolean
}

interface CreateTransactionInput {
    description: string
    amount: number
    type: string
    accountId: string
    categoryId: string
    destinationAccountId?: string
    date?: string
}

interface SearchTransactionsInput {
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

interface UpdateTransactionInput {
    description?: string
    status?: string
}

@Resolver('Transaction')
@Injectable()
export class TransactionResolver {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly searchTransactionsUseCase: SearchTransactionsUseCase,
        private readonly getTransactionSummaryUseCase: GetTransactionSummaryUseCase,
        private readonly updateTransactionUseCase: UpdateTransactionUseCase,
        private readonly reverseTransactionUseCase: ReverseTransactionUseCase
    ) { }

    @Query(() => String) // Simplified return type for now
    @UseGuards(JwtGuard)
    async searchTransactions(
        @Args('userId', { type: () => String }) userId: string,
        @Args('filters', { type: () => String, nullable: true }) filters?: string,
        @Args('sortBy', { type: () => String, nullable: true }) sortBy?: string,
        @Args('sortOrder', { type: () => String, nullable: true }) sortOrder?: string,
        @Args('page', { type: () => Number, nullable: true }) page?: number,
        @Args('limit', { type: () => Number, nullable: true }) limit?: number
    ): Promise<any> {
        const input = {
            userId,
            filters: filters ? JSON.parse(filters) : undefined,
            sortBy: sortBy as 'date' | 'amount' | 'description' | 'createdAt' | undefined,
            sortOrder: sortOrder as 'asc' | 'desc' | undefined,
            page,
            limit
        }
        return await this.searchTransactionsUseCase.execute(input)
    }

    @Query(() => String, { nullable: true }) // Simplified return type
    @UseGuards(JwtGuard)
    async transactionById(@Args('id', { type: () => String }) id: string): Promise<TransactionDto | null> {
        // Implementation would delegate to a find by ID use case
        throw new Error('Not implemented yet')
    }

    @Query(() => [String]) // Simplified return type
    @UseGuards(JwtGuard)
    async transactionsByAccount(@Args('accountId', { type: () => String }) accountId: string): Promise<TransactionDto[]> {
        const result = await this.searchTransactionsUseCase.execute({
            filters: { accountId }
        })
        return this.mapTransactionsToDto(result.items)
    }

    @Query(() => String) // Simplified return type
    @UseGuards(JwtGuard)
    async transactionSummary(
        @Args('accountId', { type: () => String }) accountId: string,
        @Args('dateFrom', { type: () => String }) dateFrom: string,
        @Args('dateTo', { type: () => String }) dateTo: string
    ): Promise<any> {
        return await this.getTransactionSummaryUseCase.execute({
            accountId,
            dateFrom: new Date(dateFrom),
            dateTo: new Date(dateTo)
        })
    }

    //     @Mutation(() => String)
    //     @UseGuards(JwtGuard)
    //     async createTransaction(
    //         @Args('input') input: CreateTransactionInput
    //     ): Promise<any> {
    //         const result = await this.createTransactionUseCase.execute({
    //             ...input,
    //             type: input.type as any,
    //             date: input.date ? new Date(input.date) : undefined
    //         })
    //
    //         return {
    //             transaction: this.mapTransactionToDto(result.transaction),
    //             success: true,
    //             message: 'Transação criada com sucesso',
    //             warnings: result.warnings
    //         }
    //     }

    //     @Mutation(() => String)
    //     @UseGuards(JwtGuard)
    //     async createIncome(
    //         @Args('input') input: Omit<CreateTransactionInput, 'type' | 'destinationAccountId'>
    //     ): Promise<any> {
    //         return await this.createTransaction({
    //             ...input,
    //             type: 'INCOME'
    //         })
    //     }

    //     @Mutation(() => String)
    //     @UseGuards(JwtGuard)
    //     async createExpense(
    //         @Args('input') input: Omit<CreateTransactionInput, 'type' | 'destinationAccountId'>
    //     ): Promise<any> {
    //         return await this.createTransaction({
    //             ...input,
    //             type: 'EXPENSE'
    //         })
    //     }

    //     @Mutation(() => String)
    //     @UseGuards(JwtGuard)
    //     async createTransfer(
    //         @Args('input') input: Omit<CreateTransactionInput, 'type'> & { destinationAccountId: string }
    //     ): Promise<any> {
    //         return await this.createTransaction({
    //             ...input,
    //             type: 'TRANSFER'
    //         })
    //     }

    //     @Mutation(() => String)
    //     @UseGuards(JwtGuard)
    //     async updateTransaction(
    //         @Args('id') id: string,
    //         @Args('input') input: UpdateTransactionInput
    //     ): Promise<TransactionDto> {
    //         const updated = await this.updateTransactionUseCase.execute({
    //             id,
    //             ...input,
    //             status: input.status as any
    //         })
    //
    //         return this.mapTransactionToDto(updated)
    //     }

    //     @Mutation(() => String)
    //     @UseGuards(JwtGuard)
    //     async reverseTransaction(
    //         @Args('transactionId') transactionId: string,
    //         @Args('reason') reason: string,
    //         @Args('requestedBy') requestedBy: string
    //     ): Promise<any> {
    //         const result = await this.reverseTransactionUseCase.execute({
    //             transactionId,
    //             reason,
    //             requestedBy
    //         })
    //
    //         return {
    //             originalTransaction: this.mapTransactionToDto(result.originalTransaction),
    //             reversalTransaction: this.mapTransactionToDto(result.reversalTransaction),
    //             success: result.success,
    //             message: result.message
    //         }
    //     }

    private mapTransactionToDto(transaction: any): TransactionDto {
        return {
            id: transaction.id,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            status: transaction.status,
            accountId: transaction.accountId,
            categoryId: transaction.categoryId,
            destinationAccountId: transaction.destinationAccountId,
            date: transaction.date,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
            isExpense: transaction.isExpense,
            isIncome: transaction.isIncome,
            isTransfer: transaction.isTransfer,
            isPending: transaction.isPending,
            isCompleted: transaction.isCompleted,
            canBeCompleted: transaction.canBeCompleted(),
            canBeCancelled: transaction.canBeCancelled(),
            canBeReversed: transaction.canBeReversed()
        }
    }

    private mapTransactionsToDto(transactions: any[]): TransactionDto[] {
        return transactions.map(transaction => this.mapTransactionToDto(transaction))
    }
}
