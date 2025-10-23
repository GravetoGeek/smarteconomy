/**
 * 💸 Transaction GraphQL Inputs
 *
 * Inputs GraphQL para operações de transações
 */

import {Field,Float,GraphQLISODateTime,InputType,Int} from '@nestjs/graphql'
import {IsEnum,IsNotEmpty,IsNumber,IsOptional,IsString,IsUUID,MaxLength,Min} from 'class-validator'
import {TransactionStatusEnum,TransactionTypeEnum} from '../models/transaction.model'

@InputType()
export class CreateTransactionInput {
    @Field(() => String)
    @IsNotEmpty({message: 'Descrição é obrigatória'})
    @IsString()
    @MaxLength(255,{message: 'Descrição deve ter no máximo 255 caracteres'})
    description: string

    @Field(() => Float)
    @IsNotEmpty({message: 'Valor é obrigatório'})
    @IsNumber()
    @Min(0.01,{message: 'Valor deve ser maior que zero'})
    amount: number

    @Field(() => TransactionTypeEnum)
    @IsNotEmpty({message: 'Tipo é obrigatório'})
    @IsEnum(TransactionTypeEnum,{message: 'Tipo inválido'})
    type: TransactionTypeEnum

    @Field(() => String)
    @IsNotEmpty({message: 'ID da conta é obrigatório'})
    @IsUUID('4',{message: 'ID da conta inválido'})
    accountId: string

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsUUID('4',{message: 'ID da categoria inválido'})
    categoryId?: string

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsUUID('4',{message: 'ID da conta destino inválido'})
    destinationAccountId?: string

    @Field(() => GraphQLISODateTime,{nullable: true})
    @IsOptional()
    date?: Date
}

@InputType()
export class UpdateTransactionInput {
    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string

    @Field(() => TransactionStatusEnum,{nullable: true})
    @IsOptional()
    @IsEnum(TransactionStatusEnum)
    status?: TransactionStatusEnum
}

@InputType()
export class TransactionFiltersInput {
    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsUUID('4')
    accountId?: string

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsUUID('4')
    categoryId?: string

    @Field(() => TransactionTypeEnum,{nullable: true})
    @IsOptional()
    @IsEnum(TransactionTypeEnum)
    type?: TransactionTypeEnum

    @Field(() => TransactionStatusEnum,{nullable: true})
    @IsOptional()
    @IsEnum(TransactionStatusEnum)
    status?: TransactionStatusEnum

    @Field(() => GraphQLISODateTime,{nullable: true})
    @IsOptional()
    dateFrom?: Date

    @Field(() => GraphQLISODateTime,{nullable: true})
    @IsOptional()
    dateTo?: Date

    @Field(() => Float,{nullable: true})
    @IsOptional()
    @IsNumber()
    minAmount?: number

    @Field(() => Float,{nullable: true})
    @IsOptional()
    @IsNumber()
    maxAmount?: number

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsString()
    searchTerm?: string
}

@InputType()
export class SearchTransactionsInput {
    @Field(() => TransactionFiltersInput,{nullable: true})
    @IsOptional()
    filters?: TransactionFiltersInput

    @Field(() => Int,{nullable: true})
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number

    @Field(() => Int,{nullable: true})
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsString()
    sortBy?: string

    @Field(() => String,{nullable: true})
    @IsOptional()
    @IsString()
    sortOrder?: string
}
