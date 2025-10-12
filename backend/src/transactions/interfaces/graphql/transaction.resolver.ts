/**
 * 📡 Transaction GraphQL Resolver
 *
 * Resolver principal para operações de transações via GraphQL
 * seguindo os padrões estabelecidos no projeto.
 */

import {Injectable,UseGuards} from '@nestjs/common'
import {Args,Mutation,Query,Resolver} from '@nestjs/graphql'
import {JwtGuard} from '../../../auth/infrastructure/guards/jwt.guard'
import {
    CreateTransactionUseCase,
    GetTransactionSummaryUseCase,
    ReverseTransactionUseCase,
    SearchTransactionsUseCase,
    UpdateTransactionUseCase
} from '../../application'

// GraphQL Models and Inputs
import {
    CreateTransactionResponse,
    Transaction,
    TransactionSearchResult,
    TransactionSummary
} from './models/transaction.model'

import {
    CreateTransactionInput,
    SearchTransactionsInput,
    UpdateTransactionInput
} from './inputs/transaction.input'

@Resolver(() => Transaction)
@Injectable()
export class TransactionResolver {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly searchTransactionsUseCase: SearchTransactionsUseCase,
        private readonly getTransactionSummaryUseCase: GetTransactionSummaryUseCase,
        private readonly updateTransactionUseCase: UpdateTransactionUseCase,
        private readonly reverseTransactionUseCase: ReverseTransactionUseCase
    ) {}

    @Mutation(() => CreateTransactionResponse)
    @UseGuards(JwtGuard)
    async createTransaction(
        @Args('input') input: CreateTransactionInput
    ): Promise<CreateTransactionResponse> {
        const result=await this.createTransactionUseCase.execute({
            description: input.description,
            amount: input.amount,
            type: input.type,
            accountId: input.accountId,
            categoryId: input.categoryId,
            destinationAccountId: input.destinationAccountId,
            date: input.date
        })

        return {
            transaction: result.transaction as any,
            warnings: result.warnings
        }
    }

    @Query(() => TransactionSearchResult)
    @UseGuards(JwtGuard)
    async searchTransactions(
        @Args('userId') userId: string,
        @Args('input',{nullable: true}) input?: SearchTransactionsInput
    ): Promise<TransactionSearchResult> {
        const result=await this.searchTransactionsUseCase.execute({
            filters: input?.filters? {
                accountId: input.filters.accountId,
                categoryId: input.filters.categoryId,
                type: input.filters.type,
                status: input.filters.status,
                dateFrom: input.filters.dateFrom?.toISOString(),
                dateTo: input.filters.dateTo?.toISOString(),
                minAmount: input.filters.minAmount,
                maxAmount: input.filters.maxAmount,
                searchTerm: input.filters.searchTerm
            }:undefined,
            page: input?.page||1,
            limit: input?.limit||10,
            sortBy: input?.sortBy as any,
            sortOrder: input?.sortOrder as any
        })

        // Map domain result to GraphQL schema
        return {
            transactions: (result.items||[]) as any,
            total: result.total||0,
            page: result.currentPage||1,
            limit: input?.limit||10,
            totalPages: result.totalPages||0
        }
    }

    @Query(() => TransactionSummary)
    @UseGuards(JwtGuard)
    async transactionSummary(
        @Args('accountId') accountId: string,
        @Args('dateFrom') dateFrom: Date,
        @Args('dateTo') dateTo: Date
    ): Promise<TransactionSummary> {
        const result=await this.getTransactionSummaryUseCase.execute({
            accountId,
            dateFrom,
            dateTo
        })

        return result as any
    }

    @Mutation(() => Transaction)
    @UseGuards(JwtGuard)
    async updateTransaction(
        @Args('id') id: string,
        @Args('input') input: UpdateTransactionInput
    ): Promise<Transaction> {
        const result=await this.updateTransactionUseCase.execute({
            id,
            description: input.description,
            status: input.status as any
        })

        return result as any
    }

    @Mutation(() => Transaction)
    @UseGuards(JwtGuard)
    async reverseTransaction(
        @Args('transactionId') transactionId: string,
        @Args('reason') reason: string,
        @Args('requestedBy') requestedBy: string
    ): Promise<Transaction> {
        const result=await this.reverseTransactionUseCase.execute({
            transactionId,
            reason,
            requestedBy
        })
        return result.reversalTransaction as any
    }
}
