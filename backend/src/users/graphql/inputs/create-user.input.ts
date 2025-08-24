import {Field,InputType} from '@nestjs/graphql'
import {IsEmail,IsEnum,IsString,IsUUID,MaxLength,MinLength} from 'class-validator'
import {UserRole} from '../../dto/create-user.dto'

@InputType()
export class CreateUserInput {
    @Field()
    @IsEmail()
    email: string

    @Field()
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    name: string

    @Field()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname: string

    @Field()
    @IsString()
    birthdate: string

    @Field()
    @IsString()
    role: string

    @Field()
    @IsString()
    genderId: string

    @Field()
    @IsString()
    professionId: string

    @Field()
    @IsString()
    @MinLength(8)
    password: string
}
