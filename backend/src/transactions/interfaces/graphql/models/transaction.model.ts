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

// Registrar enums no GraphQL
registerEnumType(TransactionTypeEnum,{
    name: 'TransactionType',
    description: 'Tipo da transação'
})

registerEnumType(TransactionStatusEnum,{
    name: 'TransactionStatus',
    description: 'Status da transação'
})

@ObjectType()
export class Transaction {
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

    @Field()
    categoryId: string

    @Field({nullable: true})
    destinationAccountId?: string

    @Field()
    date: Date

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}

@ObjectType()
export class TransactionSearchResult {
    @Field(() => [Transaction])
    transactions: Transaction[]

    @Field()
    total: number

    @Field()
    page: number

    @Field()
    limit: number

    @Field()
    totalPages: number
}

@ObjectType()
export class TransactionSummary {
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
export class CreateTransactionResponse {
    @Field(() => Transaction)
    transaction: Transaction

    @Field(() => [String])
    warnings: string[]
}
