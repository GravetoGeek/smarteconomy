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
    CreateTransactionResponseModel,
    TransactionModel,
    TransactionSearchResultModel,
    TransactionSummaryModel
} from '../dtos/models/transaction.model'

import {
    CreateTransactionInput,
    SearchTransactionsInput,
    UpdateTransactionInput
} from '../dtos/inputs/transaction.input'
import {TransactionGraphQLMapper} from './mappers/transaction-graphql.mapper'
@Resolver(() => TransactionModel)
@Injectable()
export class TransactionResolver {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly searchTransactionsUseCase: SearchTransactionsUseCase,
        private readonly getTransactionSummaryUseCase: GetTransactionSummaryUseCase,
        private readonly updateTransactionUseCase: UpdateTransactionUseCase,
        private readonly reverseTransactionUseCase: ReverseTransactionUseCase
    ) {}

    @Mutation(() => CreateTransactionResponseModel)
    @UseGuards(JwtGuard)
    async createTransaction(
        @Args('input') input: CreateTransactionInput
    ): Promise<CreateTransactionResponseModel> {
        const result=await this.createTransactionUseCase.execute({
            description: input.description,
            amount: input.amount,
            type: input.type,
            accountId: input.accountId,
            categoryId: input.categoryId,
            destinationAccountId: input.destinationAccountId,
            date: input.date
        })

        return TransactionGraphQLMapper.toCreateResponseModel(result.transaction,result.warnings)
    }

    @Query(() => TransactionSearchResultModel)
    @UseGuards(JwtGuard)
    async searchTransactions(
        @Args('userId') userId: string,
        @Args('input',{nullable: true}) input?: SearchTransactionsInput
    ): Promise<TransactionSearchResultModel> {
        const limit=input?.limit||10
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
            limit,
            sortBy: input?.sortBy as any,
            sortOrder: input?.sortOrder as any
        })

        return TransactionGraphQLMapper.toSearchResultModel(result,limit)
    }

    @Query(() => TransactionSummaryModel)
    @UseGuards(JwtGuard)
    async transactionSummary(
        @Args('accountId') accountId: string,
        @Args('dateFrom') dateFrom: Date,
        @Args('dateTo') dateTo: Date
    ): Promise<TransactionSummaryModel> {
        const result=await this.getTransactionSummaryUseCase.execute({
            accountId,
            dateFrom,
            dateTo
        })

        return TransactionGraphQLMapper.toSummaryModel(result)
    }

    @Mutation(() => TransactionModel)
    @UseGuards(JwtGuard)
    async updateTransaction(
        @Args('id') id: string,
        @Args('input') input: UpdateTransactionInput
    ): Promise<TransactionModel> {
        const result=await this.updateTransactionUseCase.execute({
            id,
            description: input.description,
            status: input.status
        })

        return TransactionGraphQLMapper.toModel(result)
    }

    @Mutation(() => TransactionModel)
    @UseGuards(JwtGuard)
    async reverseTransaction(
        @Args('transactionId') transactionId: string,
        @Args('reason') reason: string,
        @Args('requestedBy') requestedBy: string
    ): Promise<TransactionModel> {
        const result=await this.reverseTransactionUseCase.execute({
            transactionId,
            reason,
            requestedBy
        })
        return TransactionGraphQLMapper.toModel(result.reversalTransaction)
    }
}
