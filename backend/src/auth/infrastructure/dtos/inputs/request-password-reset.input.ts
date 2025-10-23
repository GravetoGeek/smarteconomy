import {Field,InputType} from '@nestjs/graphql'
import {IsEmail} from 'class-validator'

@InputType()
export class RequestPasswordResetInput {
    @Field()
    @IsEmail()
    email: string
}
