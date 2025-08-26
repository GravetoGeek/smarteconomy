import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator'

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
