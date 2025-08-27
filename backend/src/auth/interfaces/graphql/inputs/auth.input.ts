import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsEmail, IsString, MinLength, IsDateString, IsUUID } from 'class-validator'

@InputType()
export class LoginInput {
    @Field()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string

    @Field()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string
}

@InputType()
export class SignupInput {
    @Field()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string

    @Field()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string

    @Field()
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    name: string

    @Field()
    @IsNotEmpty({ message: 'Lastname is required' })
    @IsString({ message: 'Lastname must be a string' })
    @MinLength(2, { message: 'Lastname must be at least 2 characters long' })
    lastname: string

    @Field()
    @IsNotEmpty({ message: 'Birthdate is required' })
    @IsDateString({}, { message: 'Birthdate must be a valid date' })
    birthdate: string

    @Field()
    @IsNotEmpty({ message: 'Gender ID is required' })
    @IsUUID(4, { message: 'Gender ID must be a valid UUID' })
    genderId: string

    @Field()
    @IsNotEmpty({ message: 'Profession ID is required' })
    @IsUUID(4, { message: 'Profession ID must be a valid UUID' })
    professionId: string
}

@InputType()
export class RefreshTokenInput {
    @Field()
    @IsNotEmpty({ message: 'Refresh token is required' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string
}

@InputType()
export class LogoutInput {
    @Field()
    @IsNotEmpty({ message: 'Access token is required' })
    @IsString({ message: 'Access token must be a string' })
    accessToken: string
}

@InputType()
export class ValidateTokenInput {
    @Field()
    @IsNotEmpty({ message: 'Access token is required' })
    @IsString({ message: 'Access token must be a string' })
    accessToken: string
}
