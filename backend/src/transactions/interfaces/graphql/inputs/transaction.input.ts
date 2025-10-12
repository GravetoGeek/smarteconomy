/**
 * 💸 Transaction GraphQL Inputs
 *
 * Inputs GraphQL para operações de transações
 */

import {Field,Float,InputType} from '@nestjs/graphql'
import {IsEnum,IsNotEmpty,IsNumber,IsOptional,IsString,IsUUID,MaxLength,Min} from 'class-validator'
import {TransactionStatusEnum,TransactionTypeEnum} from '../models/transaction.model'

@InputType()
export class CreateTransactionInput {
    @Field()
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

    @Field()
    @IsNotEmpty({message: 'ID da conta é obrigatório'})
    @IsUUID('4',{message: 'ID da conta inválido'})
    accountId: string

    @Field({nullable: true})
    @IsOptional()
    @IsUUID('4',{message: 'ID da categoria inválido'})
    categoryId?: string

    @Field({nullable: true})
    @IsOptional()
    @IsUUID('4',{message: 'ID da conta destino inválido'})
    destinationAccountId?: string

    @Field({nullable: true})
    @IsOptional()
    date?: Date
}

@InputType()
export class UpdateTransactionInput {
    @Field({nullable: true})
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
    @Field({nullable: true})
    @IsOptional()
    @IsUUID('4')
    accountId?: string

    @Field({nullable: true})
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

    @Field({nullable: true})
    @IsOptional()
    dateFrom?: Date

    @Field({nullable: true})
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

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    searchTerm?: string
}

@InputType()
export class SearchTransactionsInput {
    @Field(() => TransactionFiltersInput,{nullable: true})
    @IsOptional()
    filters?: TransactionFiltersInput

    @Field({nullable: true})
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number

    @Field({nullable: true})
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    sortBy?: string

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    sortOrder?: string
}
