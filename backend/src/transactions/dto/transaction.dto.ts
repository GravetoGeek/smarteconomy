/**
 * 📝 Transaction DTOs
 *
 * Data Transfer Objects para validação e transformação
 * de dados de entrada e saída da API de transações.
 */

import { Field, InputType, ObjectType, registerEnumType, ID, Float } from '@nestjs/graphql'
import { IsEnum, IsString, IsNumber, IsOptional, IsDateString, Min, Max, Length, IsUUID } from 'class-validator'
import { Transform } from 'class-transformer'
import { TransactionType, TransactionStatus } from '../domain'

// Registrar enums no GraphQL
registerEnumType(TransactionType, {
    name: 'TransactionType',
    description: 'Tipos de transação disponíveis'
})

registerEnumType(TransactionStatus, {
    name: 'TransactionStatus',
    description: 'Status possíveis de uma transação'
})

// Input DTOs
@InputType()
export class CreateTransactionInput {
    @Field()
    @IsString()
    @Length(2, 255, { message: 'Descrição deve ter entre 2 e 255 caracteres' })
    description: string

    @Field(() => Float)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor deve ter no máximo 2 casas decimais' })
    @Min(0.01, { message: 'Valor deve ser maior que zero' })
    @Max(999999.99, { message: 'Valor não pode exceder R$ 999.999,99' })
    @Transform(({ value }) => Math.round(value * 100) / 100)
    amount: number

    @Field(() => TransactionType)
    @IsEnum(TransactionType, { message: 'Tipo de transação inválido' })
    type: TransactionType

    @Field()
    @IsUUID('4', { message: 'ID da conta deve ser um UUID válido' })
    accountId: string

    @Field()
    @IsUUID('4', { message: 'ID da categoria deve ser um UUID válido' })
    categoryId: string

    @Field({ nullable: true })
    @IsOptional()
    @IsUUID('4', { message: 'ID da conta de destino deve ser um UUID válido' })
    destinationAccountId?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString({}, { message: 'Data deve estar no formato ISO 8601' })
    date?: string
}

@InputType()
export class UpdateTransactionInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @Length(2, 255, { message: 'Descrição deve ter entre 2 e 255 caracteres' })
    description?: string

    @Field(() => TransactionStatus, { nullable: true })
    @IsOptional()
    @IsEnum(TransactionStatus, { message: 'Status de transação inválido' })
    status?: TransactionStatus
}

@InputType()
export class TransactionFiltersInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsUUID('4')
    accountId?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsUUID('4')
    categoryId?: string

    @Field(() => TransactionType, { nullable: true })
    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType

    @Field(() => TransactionStatus, { nullable: true })
    @IsOptional()
    @IsEnum(TransactionStatus)
    status?: TransactionStatus

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    dateFrom?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    dateTo?: string

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minAmount?: number

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxAmount?: number

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    @Length(2, 100)
    searchTerm?: string
}

@InputType()
export class SearchTransactionsInput {
    @Field(() => TransactionFiltersInput, { nullable: true })
    @IsOptional()
    filters?: TransactionFiltersInput

    @Field({ nullable: true, defaultValue: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number

    @Field({ nullable: true, defaultValue: 20 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number

    @Field({ nullable: true, defaultValue: 'date' })
    @IsOptional()
    @IsString()
    sortBy?: 'date' | 'amount' | 'description' | 'createdAt'

    @Field({ nullable: true, defaultValue: 'desc' })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc'
}

// Output DTOs
@ObjectType()
export class TransactionDto {
    @Field(() => ID)
    id: string

    @Field()
    description: string

    @Field(() => Float)
    amount: number

    @Field(() => TransactionType)
    type: TransactionType

    @Field(() => TransactionStatus)
    status: TransactionStatus

    @Field()
    accountId: string

    @Field()
    categoryId: string

    @Field({ nullable: true })
    destinationAccountId?: string

    @Field()
    date: Date

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date

    // Computed fields
    @Field()
    isExpense: boolean

    @Field()
    isIncome: boolean

    @Field()
    isTransfer: boolean

    @Field()
    isPending: boolean

    @Field()
    isCompleted: boolean

    @Field()
    canBeCompleted: boolean

    @Field()
    canBeCancelled: boolean

    @Field()
    canBeReversed: boolean
}

@ObjectType()
export class TransactionSearchResultDto {
    @Field(() => [TransactionDto])
    items: TransactionDto[]

    @Field()
    total: number

    @Field()
    currentPage: number

    @Field()
    totalPages: number

    @Field()
    hasNextPage: boolean

    @Field()
    hasPreviousPage: boolean
}

@ObjectType()
export class TransactionSummaryDto {
    @Field(() => Float)
    totalIncome: number

    @Field(() => Float)
    totalExpenses: number

    @Field(() => Float)
    totalTransfers: number

    @Field(() => Float)
    netAmount: number

    @Field()
    transactionCount: number

    @Field()
    periodFrom: Date

    @Field()
    periodTo: Date
}

@ObjectType()
export class TransactionStatisticsDto {
    @Field()
    totalTransactions: number

    @Field(() => Float)
    totalIncome: number

    @Field(() => Float)
    totalExpenses: number

    @Field(() => Float)
    averageTransaction: number

    @Field(() => Float)
    largestTransaction: number

    @Field(() => Float)
    smallestTransaction: number
}

@ObjectType()
export class ProcessTransactionResponseDto {
    @Field(() => TransactionDto)
    transaction: TransactionDto

    @Field()
    success: boolean

    @Field()
    message: string

    @Field(() => [String], { nullable: true })
    warnings?: string[]
}

// Specialized input DTOs
@InputType()
export class CreateIncomeInput {
    @Field()
    @IsString()
    @Length(2, 255)
    description: string

    @Field(() => Float)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(999999.99)
    amount: number

    @Field()
    @IsUUID('4')
    accountId: string

    @Field()
    @IsUUID('4')
    categoryId: string

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    date?: string
}

@InputType()
export class CreateExpenseInput {
    @Field()
    @IsString()
    @Length(2, 255)
    description: string

    @Field(() => Float)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(999999.99)
    amount: number

    @Field()
    @IsUUID('4')
    accountId: string

    @Field()
    @IsUUID('4')
    categoryId: string

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    date?: string
}

@InputType()
export class CreateTransferInput {
    @Field()
    @IsString()
    @Length(2, 255)
    description: string

    @Field(() => Float)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Max(999999.99)
    amount: number

    @Field()
    @IsUUID('4')
    accountId: string

    @Field()
    @IsUUID('4')
    destinationAccountId: string

    @Field()
    @IsUUID('4')
    categoryId: string

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    date?: string
}
