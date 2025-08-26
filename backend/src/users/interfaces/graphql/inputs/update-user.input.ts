import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { CreateUserInput } from './create-user.input'

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name?: string

    @Field()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname?: string

    @Field()
    @IsOptional()
    @IsUUID()
    genderId?: string

    @Field()
    @IsOptional()
    @IsUUID()
    professionId?: string

    @Field({ nullable: true })
    @IsOptional()
    profileId?: string

    @Field()
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string
}
