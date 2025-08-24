import {Field,InputType} from '@nestjs/graphql'
import {IsEmail,IsOptional,IsString,MaxLength,MinLength} from 'class-validator'

@InputType()
export class UpdateUserInput {
    @Field({nullable: true})
    @IsOptional()
    @IsEmail()
    email?: string

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name?: string

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname?: string

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string
}
