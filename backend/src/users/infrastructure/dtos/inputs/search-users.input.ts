import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator'

@InputType()
export class SearchUsersInput {
    @Field(() => Int)
    @IsPositive()
    @Min(1)
    page: number

    @Field(() => Int)
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    filter?: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    sort?: string

    @Field({ nullable: true })
    @IsOptional()
    sortDirection?: 'asc' | 'desc'
}
