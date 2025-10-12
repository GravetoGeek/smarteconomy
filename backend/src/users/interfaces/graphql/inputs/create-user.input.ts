import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { UserRole } from '../../../domain/user.entity'

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastname: string

    @Field()
    @IsNotEmpty()
    birthdate: string

    @Field(() => String)
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole

    @Field()
    @IsNotEmpty()
    @IsUUID()
    genderId: string

    @Field()
    @IsNotEmpty()
    @IsUUID()
    professionId: string

    @Field({ nullable: true })
    profileId?: string

    @Field()
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string
}
