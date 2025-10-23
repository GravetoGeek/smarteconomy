import {Field,ObjectType} from '@nestjs/graphql'

@ObjectType()
export class PasswordResetResponse {
    @Field()
    success: boolean

    @Field()
    message: string
}
