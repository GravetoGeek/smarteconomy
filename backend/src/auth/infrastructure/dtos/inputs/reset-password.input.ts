import {Field,InputType} from '@nestjs/graphql'
import {MinLength} from 'class-validator'

@InputType()
export class ResetPasswordInput {
    @Field()
    token: string

    @Field()
    @MinLength(6)
    newPassword: string
}
