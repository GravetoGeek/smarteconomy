import {Field,ObjectType} from '@nestjs/graphql'

@ObjectType()
export class AuthUser {
    @Field()
    id: string

    @Field()
    email: string

    @Field()
    role: string
}

@ObjectType()
export class AuthResponse {
    @Field()
    accessToken: string

    @Field()
    refreshToken: string

    @Field()
    expiresIn: number

    @Field()
    tokenType: string

    @Field(() => AuthUser)
    user: AuthUser
}

@ObjectType()
export class LogoutResponse {
    @Field()
    success: boolean

    @Field()
    message: string
}

@ObjectType()
export class ValidateTokenResponse {
    @Field()
    valid: boolean

    @Field(() => AuthUser,{nullable: true})
    user?: AuthUser|null
}
