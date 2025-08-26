import { Field, ObjectType } from '@nestjs/graphql'
import { User } from './User'

@ObjectType()
export class UpdateUserResponse {
    @Field()
    success: boolean

    @Field(() => User)
    user: User

    @Field()
    message: string
}
