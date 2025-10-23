/**
 * 💸 Transaction GraphQL Models
 *
 * Modelos GraphQL para transações
 */

import {Field,Float,ID,ObjectType,registerEnumType} from '@nestjs/graphql'

export enum TransactionTypeEnum {
    INCOME='INCOME',
    EXPENSE='EXPENSE',
    TRANSFER='TRANSFER'
}

export enum TransactionStatusEnum {
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    CANCELLED='CANCELLED',
    FAILED='FAILED'
}

registerEnumType(TransactionTypeEnum,{
    name: 'TransactionType',
    description: 'Tipo da transação'
})

registerEnumType(TransactionStatusEnum,{
    name: 'TransactionStatus',
    description: 'Status da transação'
})

@ObjectType()
export class TransactionModel {
    @Field(() => ID)
    id: string

    @Field()
    description: string

    @Field(() => Float)
    amount: number

    @Field(() => TransactionTypeEnum)
    type: TransactionTypeEnum

    @Field(() => TransactionStatusEnum)
    status: TransactionStatusEnum

    @Field()
    accountId: string

    @Field(() => String,{nullable: true})
    categoryId?: string|null

    @Field(() => String,{nullable: true})
    destinationAccountId?: string|null

    @Field()
    date: Date

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}

@ObjectType()
export class TransactionSearchResultModel {
    @Field(() => [TransactionModel],{defaultValue: []})
    transactions: TransactionModel[]

    @Field({defaultValue: 0})
    total: number

    @Field({defaultValue: 1})
    page: number

    @Field({defaultValue: 10})
    limit: number

    @Field({defaultValue: 0})
    totalPages: number
}

@ObjectType()
export class TransactionSummaryModel {
    @Field(() => Float)
    totalIncome: number

    @Field(() => Float)
    totalExpense: number

    @Field(() => Float)
    totalTransfer: number

    @Field(() => Float)
    balance: number

    @Field()
    period: string
}

@ObjectType()
export class CreateTransactionResponseModel {
    @Field(() => TransactionModel)
    transaction: TransactionModel

    @Field(() => [String])
    warnings: string[]
}
